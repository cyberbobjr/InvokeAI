"""
OpenAI vision image analysis invocation for InvokeAI.
"""

import base64
import io
from typing import Literal

import requests
from PIL import Image
from invokeai.invocation_api import (
    BaseInvocation,
    ImageField,
    InputField,
    InvocationContext,
    StringOutput,
    invocation,
)
from invokeai.app.services.config import get_config


@invocation(
    "claude_analyze_image", 
    title="OpenAI Analyze Image", 
    tags=["image", "analysis", "openai", "gpt-4", "vision"], 
    category="image_analysis", 
    version="1.0.0"
)
class OpenAIAnalyzeImageInvocation(BaseInvocation):
    """Analyze an image using OpenAI's GPT-4 Vision model."""

    image: ImageField = InputField(description="The image to analyze")
    model_architecture: Literal["sentence_based", "tag_based"] = InputField(
        default="sentence_based", 
        description="The model architecture to use - sentence_based for phrase prompts, tag_based for SD1.5 tag prompts"
    )
    openai_api_key: str = InputField(
        default="",
        description="OpenAI API key (if not set, will try to use OPENAI_API_KEY environment variable)"
    )
    model: Literal["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"] = InputField(
        default="gpt-4o-mini",
        description="OpenAI model to use for image analysis"
    )
    max_tokens: int = InputField(
        default=1000,
        ge=1,
        le=4000,
        description="Maximum number of tokens in the response"
    )

    def invoke(self, context: InvocationContext) -> StringOutput:
        prompt: str = f"""
        Analyze this image in extreme detail. Provide a scene description suitable for image generation. Break it down into:

    Overall scene & environment – setting, time of day, atmosphere, background elements, weather, lighting.

    Characters or subjects – physical description, clothing, colors, accessories, age, gender, ethnicity, distinctive features.

    Postures & actions – body positions, gestures, facial expressions, interactions between subjects, orientation in space.

    Composition & perspective – camera angle, zoom (close-up, mid-shot, wide), depth, symmetry or asymmetry, focal point.

    Artistic style – realism, cartoon, digital art, sketch, cinematic, etc.

    Fine details – textures, patterns, symbols, props, background objects.

    ⚠️ Do not start with phrases like “This is an image of.” Write as if directly describing the scene for a text-to-image model.
        """
        # Get the image
        image = context.images.get_pil(self.image.image_name)
        
        # Convert image to base64
        image_base64 = self._convert_image_to_base64(image)
        
        # Get API key
        config = get_config()
        openai_api_key = config.openai_api_key

        if not openai_api_key:
            raise ValueError("OpenAI API key not found in InvokeAI configuration. Please set it in invokeai.yaml or via INVOKEAI_OPENAI_API_KEY environment variable.") 
        
        # Adapt prompt based on model architecture
        if self.model_architecture == "tag_based":
            analysis_prompt = f"{prompt} FORMAT YOUR RESPONSE AS COMMA-SEPARATED TAGS ONLY (like: tag1, tag2, tag3) IN ENGLISH. No sentences, no descriptions, only tags suitable for SD1.5."
        else:  # sentence_based
            analysis_prompt = f"{prompt} FORMAT YOUR RESPONSE IN ENGLISH SENTENCES. Provide a detailed description in proper English."

        # Prepare the request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": analysis_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": self.max_tokens
        }
        
        try:
            # Make the API call
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=60
            )
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            analysis_text = result["choices"][0]["message"]["content"]
            
            return StringOutput(value=analysis_text)
            
        except requests.RequestException as e:
            error_msg = f"Error calling OpenAI API: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except (KeyError, IndexError) as e:
            error_msg = f"Error parsing OpenAI API response: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except Exception as e:
            error_msg = f"Unexpected error in OpenAI analysis: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)

    def _convert_image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL image to base64 string."""
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Save to bytes buffer
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=85)
        buffer.seek(0)
        
        # Encode to base64
        image_bytes = buffer.getvalue()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        
        return image_base64


@invocation(
    "claude_expand_prompt", 
    title="OpenAI Expand Prompt", 
    tags=["prompt", "text", "openai", "gpt-4", "enhancement"], 
    category="prompt_engineering", 
    version="1.0.0"
)
class OpenAIExpandPromptInvocation(BaseInvocation):
    """Expand and enhance a prompt using OpenAI's GPT models."""

    prompt: str = InputField(
        description="The prompt to expand and enhance"
    )
    model_architecture: Literal["tag_based", "sentence_based"] = InputField(
        default="tag_based", 
        description="The model architecture to use - sentence_based for phrase prompts, tag_based for SD1.5 tag prompts"
    )
    model: Literal["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"] = InputField(
        default="gpt-4o-mini",
        description="OpenAI model to use for prompt expansion"
    )
    max_tokens: int = InputField(
        default=500,
        ge=1,
        le=2000,
        description="Maximum number of tokens in the response"
    )

    def invoke(self, context: InvocationContext) -> StringOutput:
        # Get API key
        config = get_config()
        openai_api_key = config.openai_api_key

        if not openai_api_key:
            raise ValueError("OpenAI API key not found in InvokeAI configuration. Please set it in invokeai.yaml or via INVOKEAI_OPENAI_API_KEY environment variable.") 
        
        # Create enhancement prompt based on model architecture
        if self.model_architecture == "tag_based":
            system_prompt = "Expand this image generation prompt into detailed comma-separated tags suitable for SD1.5. Use specific descriptive tags, no sentences. Example format: 'detailed face, blue eyes, blonde hair, medieval armor, fantasy art, high quality, 8k'"
            full_prompt = f"{system_prompt}\n\nOriginal prompt: {self.prompt}\n\nExpanded tags:"
        else:  # sentence_based
            system_prompt = "Expand this image generation prompt with rich details, specific visual elements, lighting, composition, and artistic style. **THE PROMPT MUST BE IN ENGLISH** Keep the core concept but make it much more descriptive and vivid using complete sentences."
            full_prompt = f"{system_prompt}\n\nOriginal prompt: {self.prompt}\n\nExpanded prompt:"
        
        # Prepare the request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert at creating prompts for AI image generation. Adapt your response format based on the requested architecture: use comma-separated tags for SD1.5 (tag_based) or detailed sentences for modern models (sentence_based)."
                },
                {
                    "role": "user",
                    "content": full_prompt
                }
            ],
            "max_tokens": self.max_tokens,
            "temperature": 0.7
        }
        
        try:
            # Make the API call
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=60
            )
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            expanded_prompt = result["choices"][0]["message"]["content"].strip()
            
            return StringOutput(value=expanded_prompt)
            
        except requests.RequestException as e:
            error_msg = f"Error calling OpenAI API: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except (KeyError, IndexError) as e:
            error_msg = f"Error parsing OpenAI API response: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except Exception as e:
            error_msg = f"Unexpected error in OpenAI prompt expansion: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)


@invocation(
    "claude_translate_prompt", 
    title="Claude Translate Prompt", 
    tags=["prompt", "translation", "openai", "claude", "text"], 
    category="prompt_engineering", 
    version="1.0.0"
)
class ClaudeTranslatePromptInvocation(BaseInvocation):
    """Translate a prompt to English using Claude via OpenAI API."""

    prompt: str = InputField(
        description="The prompt to translate to English"
    )
    model: Literal["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"] = InputField(
        default="gpt-4o-mini",
        description="OpenAI model to use for translation"
    )
    max_tokens: int = InputField(
        default=500,
        ge=1,
        le=2000,
        description="Maximum number of tokens in the response"
    )

    def invoke(self, context: InvocationContext) -> StringOutput:
        # Get API key
        config = get_config()
        openai_api_key = config.openai_api_key

        if not openai_api_key:
            raise ValueError("OpenAI API key not found in InvokeAI configuration. Please set it in invokeai.yaml or via INVOKEAI_OPENAI_API_KEY environment variable.") 
        
        # Create translation prompt
        system_prompt = "You are a professional translator. Translate the given prompt accurately to English. Maintain the original meaning, style, and artistic intent. If it's an image generation prompt, keep technical terms and artistic concepts that work well for AI image generation."
        user_prompt = f"Translate this prompt to English:\n\n{self.prompt}\n\nTranslation:"
        
        # Prepare the request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "max_tokens": self.max_tokens,
            "temperature": 0.3  # Lower temperature for more consistent translations
        }
        
        try:
            # Make the API call
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=60
            )
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            translated_prompt = result["choices"][0]["message"]["content"].strip()
            
            return StringOutput(value=translated_prompt)
            
        except requests.RequestException as e:
            error_msg = f"Error calling OpenAI API: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except (KeyError, IndexError) as e:
            error_msg = f"Error parsing OpenAI API response: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
        except Exception as e:
            error_msg = f"Unexpected error in prompt translation: {str(e)}"
            context.logger.error(error_msg)
            return StringOutput(value=error_msg)
