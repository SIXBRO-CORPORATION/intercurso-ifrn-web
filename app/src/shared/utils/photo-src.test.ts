import { describe, expect, it } from "vitest"
import { resolvePhotoSrc } from "./photo-src"

describe("resolvePhotoSrc", () => {
    it("aceita URL absoluta e caminho da raiz", () => {
        expect(resolvePhotoSrc("https://cdn.exemplo.com/a.png")).toBe("https://cdn.exemplo.com/a.png")
        expect(resolvePhotoSrc("http://cdn.exemplo.com/a.png")).toBe("http://cdn.exemplo.com/a.png")
        expect(resolvePhotoSrc(" /uploads/a.png ")).toBe("/uploads/a.png")
    })

    it("devolve null para vazio (usa o fallback do avatar)", () => {
        expect(resolvePhotoSrc(null)).toBeNull()
        expect(resolvePhotoSrc(undefined)).toBeNull()
        expect(resolvePhotoSrc("   ")).toBeNull()
    })

    it("rejeita URL relativa ao protocolo, que carrega de outro host", () => {
        expect(resolvePhotoSrc("//evil.com/img.png")).toBeNull()
        expect(resolvePhotoSrc("/\\evil.com/img.png")).toBeNull()
    })

    it("rejeita esquemas inesperados e caminhos relativos", () => {
        expect(resolvePhotoSrc("javascript:alert(1)")).toBeNull()
        expect(resolvePhotoSrc("data:image/png;base64,AAAA")).toBeNull()
        expect(resolvePhotoSrc("a.png")).toBeNull()
    })
})
