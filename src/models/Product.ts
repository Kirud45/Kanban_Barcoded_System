export interface Product { 
    product_id: string; 
    product_name: string; product_line?: string; 
    stock: number; 
    reorder_point: number; 
}