let triggered = false

export function triggerPopunder() {
  if (typeof window === 'undefined') return

  if (triggered) return

  const lastShown = localStorage.getItem('wf_popunder')

  if (
    lastShown &&
    Date.now() - Number(lastShown) < 24 * 60 * 60 * 1000
  ) {
    return
  }

  const script = document.createElement('script')

  script.src =
    '//data527.click/9cc47314d0027b0cd3c7/ac4794366c/?placementName=default'

  script.async = true

  document.body.appendChild(script)

  localStorage.setItem(
    'wf_popunder',
    Date.now().toString()
  )

  triggered = true
}