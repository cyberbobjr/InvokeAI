import { z } from 'zod';

// #region Field data schemas
export const zImageField = z.object({
  image_name: z.string().trim().min(1),
});
export type ImageField = z.infer<typeof zImageField>;
export const isImageField = (field: unknown): field is ImageField => zImageField.safeParse(field).success;
const zImageFieldCollection = z.array(zImageField);
type ImageFieldCollection = z.infer<typeof zImageFieldCollection>;
export const isImageFieldCollection = (field: unknown): field is ImageFieldCollection =>
  zImageFieldCollection.safeParse(field).success;

export const zBoardField = z.object({
  board_id: z.string().trim().min(1),
});
export type BoardField = z.infer<typeof zBoardField>;

export const zColorField = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
  a: z.number().int().min(0).max(255),
});
export type ColorField = z.infer<typeof zColorField>;

export const zClassification = z.enum(['stable', 'beta', 'prototype', 'deprecated', 'internal', 'special']);
export type Classification = z.infer<typeof zClassification>;

export const zSchedulerField = z.enum([
  'euler',
  'deis',
  'ddim',
  'ddpm',
  'dpmpp_2s',
  'dpmpp_2m',
  'dpmpp_3m',
  'dpmpp_2m_sde',
  'dpmpp_sde',
  'heun',
  'kdpm_2',
  'lms',
  'pndm',
  'unipc',
  'euler_k',
  'deis_k',
  'dpmpp_2s_k',
  'dpmpp_2m_k',
  'dpmpp_3m_k',
  'dpmpp_2m_sde_k',
  'dpmpp_sde_k',
  'heun_k',
  'kdpm_2_k',
  'kdpm_2_a_k',
  'lms_k',
  'unipc_k',
  'euler_a',
  'kdpm_2_a',
  'lcm',
  'tcd',
]);
export type SchedulerField = z.infer<typeof zSchedulerField>;
// #endregion

// #region Model-related schemas
const zBaseModel = z.enum([
  'any',
  'sd-1',
  'sd-2',
  'sd-3',
  'sdxl',
  'sdxl-refiner',
  'flux',
  'cogview4',
  'imagen3',
  'imagen4',
  'chatgpt-4o',
  'flux-kontext',
]);
export type BaseModelType = z.infer<typeof zBaseModel>;
export const zMainModelBase = z.enum([
  'sd-1',
  'sd-2',
  'sd-3',
  'sdxl',
  'flux',
  'cogview4',
  'imagen3',
  'imagen4',
  'chatgpt-4o',
  'flux-kontext',
]);
type MainModelBase = z.infer<typeof zMainModelBase>;
export const isMainModelBase = (base: unknown): base is MainModelBase => zMainModelBase.safeParse(base).success;
export const zModelType = z.enum([
  'main',
  'vae',
  'lora',
  'llava_onevision',
  'control_lora',
  'controlnet',
  't2i_adapter',
  'ip_adapter',
  'embedding',
  'onnx',
  'clip_vision',
  'spandrel_image_to_image',
  't5_encoder',
  'clip_embed',
  'siglip',
  'flux_redux',
]);
const zSubModelType = z.enum([
  'unet',
  'transformer',
  'text_encoder',
  'text_encoder_2',
  'text_encoder_3',
  'tokenizer',
  'tokenizer_2',
  'tokenizer_3',
  'vae',
  'vae_decoder',
  'vae_encoder',
  'scheduler',
  'safety_checker',
]);
export type SubModelType = z.infer<typeof zSubModelType>;
export const zModelIdentifierField = z.object({
  key: z.string().min(1),
  hash: z.string().min(1),
  name: z.string().min(1),
  base: zBaseModel,
  type: zModelType,
  submodel_type: zSubModelType.nullish(),
});
export type ModelIdentifierField = z.infer<typeof zModelIdentifierField>;
// #endregion

// #region Control Adapters
const _zControlField = z.object({
  image: zImageField,
  control_model: zModelIdentifierField,
  control_weight: z.union([z.number(), z.array(z.number())]).optional(),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
  control_mode: z.enum(['balanced', 'more_prompt', 'more_control', 'unbalanced']).optional(),
  resize_mode: z.enum(['just_resize', 'crop_resize', 'fill_resize', 'just_resize_simple']).optional(),
});
export type ControlField = z.infer<typeof _zControlField>;

const _zIPAdapterField = z.object({
  image: zImageField,
  ip_adapter_model: zModelIdentifierField,
  weight: z.number(),
  method: z.enum(['full', 'style', 'composition', 'style_strong', 'style_precise']),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
});
export type IPAdapterField = z.infer<typeof _zIPAdapterField>;

const _zT2IAdapterField = z.object({
  image: zImageField,
  t2i_adapter_model: zModelIdentifierField,
  weight: z.union([z.number(), z.array(z.number())]).optional(),
  begin_step_percent: z.number().optional(),
  end_step_percent: z.number().optional(),
  resize_mode: z.enum(['just_resize', 'crop_resize', 'fill_resize', 'just_resize_simple']).optional(),
});
export type T2IAdapterField = z.infer<typeof _zT2IAdapterField>;
// #endregion

// #region ProgressImage
export const zProgressImage = z.object({
  dataURL: z.string(),
  width: z.number().int(),
  height: z.number().int(),
});
export type ProgressImage = z.infer<typeof zProgressImage>;
// #endregion

// #region ImageOutput
export const zImageOutput = z.object({
  image: zImageField,
  width: z.number().int().gt(0),
  height: z.number().int().gt(0),
  type: z.literal('image_output'),
});
export type ImageOutput = z.infer<typeof zImageOutput>;
// #endregion
