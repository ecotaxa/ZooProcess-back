const { ScanType } = require('@prisma/client')
const { isScanType } = require('../services/prisma/type.ts')

describe('ScanType enum list tests', () => {
  test('should validate if a string matches ScanType enum', () => {
    const validTypes = ['SCAN', 'BACKGROUND', 'MASK', 'RAW_BACKGROUND', 'VIS', 'MEDIUM_BACKGROUND', 'OUT']
    
    validTypes.forEach(type => {
      expect(Object.values(ScanType)).toContain(type)
    })
  })

  test('isScanType should validate scan types correctly', () => {
    // Test valid types
    expect(isScanType('BACKGROUND')).toBe(true)
    expect(isScanType('SCAN')).toBe(true)
    expect(isScanType('MASK')).toBe(true)
    
    // Test invalid types
    expect(isScanType('INVALID_TYPE')).toBe(false)
    expect(isScanType('')).toBe(false)
    expect(isScanType(null)).toBe(false)
  })
})



