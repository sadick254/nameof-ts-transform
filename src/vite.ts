import { manual } from './manual'

export function viteNameofPlugin() {
    return {
        name: 'nameof-ts-transform',
        transform(src: string) {
            return {
                code:  manual(src)
            }
        }
    }
}
