export enum Frequency {
    NEVER="never",
    ONE_TIME="one-time",
    DAILY="daily",
    WEEKLY="weekly",
    BIWEEKLY="biweekly",
    MONTHLY="monthly",
    QUARTERLY="quarterly",
    SEMI_ANNUALLY="semi-annually",
    ANNUALLY="annually",
    BIENNIALLY="biennially",
    TRIANNUALLY="triannually",
}

export type Income = {
    name: string
    frequency: Frequency
    amount: number
    startDay: {
        count: number
        type: number
    }
    duration: {
        count: number
        type: number
    }
    vault: Vault
} & (
    {
        frequencyOfChange: Frequency.NEVER
        amountOfChange?: undefined
        isPercentageChange?: undefined
    } | {
        frequencyOfChange: Exclude<Frequency, Frequency.NEVER>
        amountOfChange: number
        isPercentageChange: boolean
    }
)

export type Expense = {
    name: string
    frequency: Frequency
    amount: number
    startDay: {
        count: number
        type: number
    }
    duration: {
        count: number
        type: number
    }
    vault: Vault
} & (
    {
        frequencyOfChange: Frequency.NEVER
        amountOfChange?: undefined
        isPercentageChange?: undefined
    } | {
        frequencyOfChange: Exclude<Frequency, Frequency.NEVER>
        amountOfChange: number
        isPercentageChange: boolean
    }
)

export type CreateVault = {
    name: string,
    isExpendable: boolean
    initialMoney: number
}

export type Vault = {
    id: number
    name: string
    isExpendable: boolean
    initialMoney: number
    incomes: ({id: number} & Income)[]
    expenses: ({id: number} & Expense)[]
}

export type CreateTransfer = {
    name: string
    from: Vault
    to: Vault
    startDay: {
        count: number
        type: number
    }
    duration: {
        count: number
        type: number
    }
    amount: number
    frequency: Frequency
} & (
    {
        frequencyOfChange: Frequency.NEVER
        amountOfChange?: undefined
        isPercentageChange?: undefined
    } | {
        frequencyOfChange: Exclude<Frequency, Frequency.NEVER>
        amountOfChange: number
        isPercentageChange: boolean
    }
)
export type Transfer = {
    id: number
    name: string
    from: Vault
    to: Vault
    startDay: {
        count: number
        type: number
    }
    duration: {
        count: number
        type: number
    }
    amount: number
    frequency: Frequency
} & (
    {
        frequencyOfChange: Frequency.NEVER
        amountOfChange?: undefined
        isPercentageChange?: undefined
    } | {
        frequencyOfChange: Exclude<Frequency, Frequency.NEVER>
        amountOfChange: number
        isPercentageChange: boolean
    }
)