export interface clProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    mostBuyed: boolean;
    img: string;
    images: string[];
    quantity: number;
    style?: {
        group: string;
        label: string;
        color?: string;
    };
}
