/**
 * Zod validation schemas for forms
 */

import { z } from 'zod'
import { validatorsColombia } from './validators'

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormType = z.infer<typeof loginSchema>

// Registro Joven Schema
export const registroJovenSchema = z
  .object({
    nombre_completo: z.string().min(3, 'Nombre must be at least 3 characters'),
    fecha_nacimiento: z.string().refine(
      (date: string) => validatorsColombia.validateAgeRange(date),
      'Debes tener entre 12 y 35 años'
    ),
    edad: z.number().int().min(12, 'Mínimo 12 años').max(35, 'Máximo 35 años'),
    celular: z
      .string()
      .refine(
        (celular: string) => validatorsColombia.validateCelular(celular),
        'Celular inválido (ej: 300 1234567)'
      ),
    estados: z.array(z.string()).min(1, 'Selecciona al menos un estado'),
    consentimientos: z.object({
      datos_personales: z.boolean().refine((val: boolean) => val === true, {
        message: 'Debes aceptar el tratamiento de datos personales',
      }),
    }),
  })

export type RegistroJovenFormType = z.infer<typeof registroJovenSchema>


