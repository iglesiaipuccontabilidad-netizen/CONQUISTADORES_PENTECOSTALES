/**
 * Validation utilities for forms
 */

export const validatorsColombia = {
  // Validate Colombian cedula (Cédula de Ciudadanía)
  validateCedula: (cedula: string): boolean => {
    const cedulaRegex = /^\d{8,11}$/
    return cedulaRegex.test(cedula.replace(/\D/g, ''))
  },

  // Validate Colombian phone number
  validateCelular: (celular: string): boolean => {
    const celularRegex = /^(\+57|0057|57)?[0-9]{10}$/
    return celularRegex.test(celular.replace(/\D/g, ''))
  },

  // Format Colombian phone number
  formatCelular: (celular: string): string => {
    const digits = celular.replace(/\D/g, '')
    if (digits.length === 10) {
      return `+57${digits}`
    }
    if (digits.length === 12 && digits.startsWith('57')) {
      return `+${digits}`
    }
    return celular
  },

  // Calculate age from birth date
  calculateAge: (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  },

  // Validate age range (12-35 years)
  validateAgeRange: (birthDate: string): boolean => {
    const age = validatorsColombia.calculateAge(birthDate)
    return age >= 12 && age <= 35
  },
}
