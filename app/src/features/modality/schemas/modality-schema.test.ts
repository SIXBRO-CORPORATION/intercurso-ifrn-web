import { describe, expect, it } from "vitest"
import { modalityListSchema } from "./modality-schema"

describe("modalityListSchema", () => {
  it("aceita a lista e ignora campos extras", () => {
    const data = [{ modality_id: "m1", name: "Futsal", active: true, min_members: 5 }]
    expect(modalityListSchema.parse({ data }).data).toEqual([{ modality_id: "m1", name: "Futsal", active: true }])
  })
  it("rejeita item sem nome", () => {
    expect(() => modalityListSchema.parse({ data: [{ modality_id: "m1" }] })).toThrow()
  })
})
