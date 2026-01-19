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
    nombre: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
    fecha_nacimiento: z.string().refine(
      (date) => validatorsColombia.validateAgeRange(date),
      'La edad debe estar entre 12 y 35 años'
    ),
    edad: z.number().int().min(12).max(35),
    cedula: z
      .string()
      .refine(
        (cedula) => validatorsColombia.validateCedula(cedula),
        'Cédula inválida'
      ),
    celular: z
      .string()
      .refine(
        (celular) => validatorsColombia.validateCelular(celular),
        'Celular inválido (ej: +57 300 1234567)'
      ),
    estados: z.array(z.string()).min(1, 'Selecciona al menos un estado'),
    consentimientos: z.object({
      datos_personales: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar el consentimiento de datos personales',
      }),
      whatsapp: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar el consentimiento de WhatsApp',
      }),
      procesamiento: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar el consentimiento de procesamiento',
      }),
      terminos: z.boolean().refine((val) => val === true, {
        message: 'Debes aceptar los términos y condiciones',
      }),
    }),
  })
  .refine(
    (data) => {
      // Calculate age and verify it matches
      const calculatedAge = validatorsColombia.calculateAge(data.fecha_nacimiento)
      return calculatedAge === data.edad
    },
    {
      message: 'La edad no coincide con la fecha de nacimiento',
      path: ['edad'],
    }
  )

export type RegistroJovenFormType = z.infer<typeof registroJovenSchema>
