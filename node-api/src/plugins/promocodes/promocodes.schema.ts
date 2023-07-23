import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const dateRestriction = z.object({
    after: z.string().optional(),
    before: z.string().optional(),
})
export type DateRestrictionsType = z.infer<typeof dateRestriction>

const ageRestriction = z.object({
    eq: z.number().optional(),
    lt: z.number().optional(),
    gt: z.number().optional(),
})
export type AgeRestrictionsType = z.infer<typeof ageRestriction>

const meteoRestriction = z.object({
    is: z.string(),
    temp: z.object({
        eq: z.string().optional(),
        lt: z.string().optional(),
        gt: z.string().optional(),
    }),
})
export type MeteoRestrictionsType = z.infer<typeof meteoRestriction>

const restrictionsKeys = z.union([
    z.literal('@meteo'),
    z.literal('@age'),
    z.literal('@date'),
    z.literal('@or'),
    z.literal('@and'),
])
export type RestrictionsKeys = z.infer<typeof restrictionsKeys>

const restrictionsValues = z.union([
    dateRestriction,
    ageRestriction,
    meteoRestriction,
])
type RestrictionsValues = z.infer<typeof restrictionsValues>

// Zod won't be able to infer the type because it is recursive.
export type DeepRestrictionsType = {
    [key in RestrictionsKeys]?:
        | RestrictionsValues
        | RestrictionsValues[]
        | DeepRestrictionsType[]
}

const deepRestrictions: z.ZodType<DeepRestrictionsType> = z.lazy(() =>
    z.record(
        restrictionsKeys,
        z.union([
            restrictionsValues,
            z.array(deepRestrictions),
            z.array(restrictionsValues),
        ]),
    ),
)

const promocodePayload = z.object({
    _id: z.string(),
    name: z.string(),
    avantage: z.record(z.string(), z.number()),
    restrictions: z.array(z.record(restrictionsKeys, z.any())),
})
export type PromocodeType = z.infer<typeof promocodePayload>

const promocodeResponse = z.object({
    created: z.boolean(),
    _id: z.string(),
})

const validatePromocodePayload = z.object({
    promocode_name: z.string(),
    arguments: z.object({
        age: z.number().optional(),
        meteo: z.object({ town: z.string() }).optional(),
    }),
})
export type ValidatePromocodeType = z.infer<typeof validatePromocodePayload>

const validatedPromocodeResponse = z.object({
    promocode_name: z.string(),
    status: z.string(),
    avantage: z.record(z.string(), z.unknown()).optional(),
    reasons: z.record(z.string(), z.unknown()).optional(),
})
export type ValidateResponsePromocodeType = z.infer<
    typeof validatedPromocodeResponse
>

export const { schemas: promocodeShema, $ref } = buildJsonSchemas(
    {
        promocodePayload,
        promocodeResponse,
        validatePromocodePayload,
        validatedPromocodeResponse,
    },
    { $id: 'promocodeShema' },
)
