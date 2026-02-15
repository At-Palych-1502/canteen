interface IAllergy {
    id: number,
    name: string,
    quantity: number
}

interface IGetAllergyRes {
    allergies: IAllergy[],
    ingredients: IAllergy[]
}