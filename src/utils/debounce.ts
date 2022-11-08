export default class UseDebounce {
  timeout: any = null
  run(fn, wait) {
      if (this.timeout !== null) clearTimeout(this.timeout)
      this.timeout = setTimeout(fn, wait)
  }
}