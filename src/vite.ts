import { manual } from './manual'

export function viteNameofPlugin() {
    return {
        name: 'nameof-ts-transform',
        enforce: 'pre',
        transform(src: string) {
            return {
                code:  manual(src)
            }
        }
    }
}
