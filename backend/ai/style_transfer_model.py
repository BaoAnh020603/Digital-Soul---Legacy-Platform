import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.loaders import AttnProcsLayers
from diffusers.models.attention_processor import LoRAAttnProcessor
from PIL import Image
import numpy as np
from typing import List, Optional

class PersonalStyleTransfer:
    """
    Style Transfer sử dụng Stable Diffusion với LoRA
    Cho phép học phong cách nghệ thuật cá nhân
    """
    
    def __init__(
        self,
        model_id: str = "runwayml/stable-diffusion-v1-5",
        device: str = "cuda"
    ):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        
        # Load Stable Diffusion pipeline
        self.pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            safety_checker=None
        ).to(self.device)
        
        # Optimize với DPM Solver
        self.pipe.scheduler = DPMSolverMultistepScheduler.from_config(
            self.pipe.scheduler.config
        )
        
        # Enable memory efficient attention
        if hasattr(self.pipe, 'enable_attention_slicing'):
            self.pipe.enable_attention_slicing()
    
    def setup_lora_training(self, rank: int = 4):
        """
        Setup LoRA layers cho fine-tuning
        
        Args:
            rank: LoRA rank (thấp hơn = ít parameters hơn)
        """
        lora_attn_procs = {}
        for name in self.pipe.unet.attn_processors.keys():
            cross_attention_dim = None if name.endswith("attn1.processor") else self.pipe.unet.config.cross_attention_dim
            if name.startswith("mid_block"):
                hidden_size = self.pipe.unet.config.block_out_channels[-1]
            elif name.startswith("up_blocks"):
                block_id = int(name[len("up_blocks.")])
                hidden_size = list(reversed(self.pipe.unet.config.block_out_channels))[block_id]
            elif name.startswith("down_blocks"):
                block_id = int(name[len("down_blocks.")])
                hidden_size = self.pipe.unet.config.block_out_channels[block_id]
            
            lora_attn_procs[name] = LoRAAttnProcessor(
                hidden_size=hidden_size,
                cross_attention_dim=cross_attention_dim,
                rank=rank
            )
        
        self.pipe.unet.set_attn_processor(lora_attn_procs)
        return lora_attn_procs
    
    def train_personal_style(
        self,
        training_images: List[Image.Image],
        style_prompt: str,
        num_epochs: int = 100,
        learning_rate: float = 1e-4
    ):
        """
        Huấn luyện LoRA trên phong cách cá nhân
        
        Args:
            training_images: Danh sách ảnh mẫu của người dùng
            style_prompt: Mô tả phong cách (vd: "in the style of [user_name]")
            num_epochs: Số epochs
            learning_rate: Learning rate
        """
        # Setup LoRA
        lora_layers = self.setup_lora_training()
        
        # Lấy trainable parameters
        params_to_optimize = AttnProcsLayers(self.pipe.unet.attn_processors).parameters()
        optimizer = torch.optim.AdamW(params_to_optimize, lr=learning_rate)
        
        # Training loop
        self.pipe.unet.train()
        
        for epoch in range(num_epochs):
            for img in training_images:
                # Preprocess image
                img_tensor = self._preprocess_image(img)
                
                # Encode image to latent
                with torch.no_grad():
                    latents = self.pipe.vae.encode(img_tensor).latent_dist.sample()
                    latents = latents * self.pipe.vae.config.scaling_factor
                
                # Add noise
                noise = torch.randn_like(latents)
                timesteps = torch.randint(0, self.pipe.scheduler.config.num_train_timesteps, (1,))
                noisy_latents = self.pipe.scheduler.add_noise(latents, noise, timesteps)
                
                # Get text embeddings
                text_inputs = self.pipe.tokenizer(
                    style_prompt,
                    padding="max_length",
                    max_length=self.pipe.tokenizer.model_max_length,
                    return_tensors="pt"
                )
                text_embeddings = self.pipe.text_encoder(text_inputs.input_ids.to(self.device))[0]
                
                # Predict noise
                noise_pred = self.pipe.unet(noisy_latents, timesteps, text_embeddings).sample
                
                # Calculate loss
                loss = torch.nn.functional.mse_loss(noise_pred, noise)
                
                # Backward
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            
            if (epoch + 1) % 10 == 0:
                print(f"Epoch {epoch + 1}/{num_epochs}, Loss: {loss.item():.4f}")
        
        self.pipe.unet.eval()
        print("Training completed!")
    
    def generate_in_personal_style(
        self,
        prompt: str,
        num_inference_steps: int = 30,
        guidance_scale: float = 7.5,
        seed: Optional[int] = None
    ) -> Image.Image:
        """
        Tạo ảnh mới theo phong cách đã học
        
        Args:
            prompt: Text prompt
            num_inference_steps: Số bước inference
            guidance_scale: CFG scale
            seed: Random seed
        
        Returns:
            Generated PIL Image
        """
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        else:
            generator = None
        
        with torch.no_grad():
            image = self.pipe(
                prompt=prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                generator=generator
            ).images[0]
        
        return image
    
    def _preprocess_image(self, image: Image.Image) -> torch.Tensor:
        """Preprocess image cho VAE encoder"""
        image = image.resize((512, 512))
        image = np.array(image).astype(np.float32) / 255.0
        image = image[None].transpose(0, 3, 1, 2)
        image = torch.from_numpy(image).to(self.device)
        return 2.0 * image - 1.0
    
    def save_lora_weights(self, path: str):
        """Lưu LoRA weights"""
        self.pipe.unet.save_attn_procs(path)
    
    def load_lora_weights(self, path: str):
        """Load LoRA weights"""
        self.pipe.unet.load_attn_procs(path)
