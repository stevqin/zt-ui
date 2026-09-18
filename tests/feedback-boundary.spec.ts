import { describe, expect, it } from 'vitest'
import * as ztUi from '../src'
import { ZtMessage, ZtLoading as ZtAlertLoading } from '@ztechjs/zt-alert'

describe('imperative feedback boundary', () => {
  it('keeps imperative services in zt-alert and only exposes declarative loading', () => {
    expect(typeof ZtMessage.success).toBe('function')
    expect(typeof ZtAlertLoading.open).toBe('function')
    expect('ZtMessage' in ztUi).toBe(false)
    expect('ZtNotification' in ztUi).toBe(false)
    expect('ZtMessageBox' in ztUi).toBe(false)
    expect('ZtLoadingService' in ztUi).toBe(false)
    expect('useZtLoading' in ztUi).toBe(false)
    expect(ztUi.ZtLoading.name).toBe('ZtLoading')
  })
})
