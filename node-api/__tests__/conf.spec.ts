function sillyFunction() {
    return true
}

describe('silly function', () => {
    test('returns true', () => {
        expect(sillyFunction()).toEqual(true)
    })
})
