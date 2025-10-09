export type FormaPagamento = 'Dinheiro' | 'Crédito' | 'Débito' | 'Pix' | 'Boleto';
export interface Produto { id:string; codigo:string; nome:string; preco:number; codigoBarras?:string; unidade?:'UN'|'KG'|'L'; ncm?:string; peso?:number; cstIpi?:string; cstCofins?:string; cstPis?:string; imagemUrl?:string; subgrupo?:'Mercearia'|'Frios'|'Higiene'|'Limpeza'|'Bebidas'; ativo?:boolean; estoque:number; }
export interface VendaItem { id:string; produtoId:string; quantidade:number; valorUnitario:number; }
export interface Venda { id:string; data:string; cpf?:string; formaPagamento:FormaPagamento; itens:VendaItem[]; total:number; }
export interface DashboardResumo { faturamentoDiario:number; totalVendasDia:number; ticketMedio:number; vendasPorHora:{hora:number;sexta:number;sabado:number;domingo:number}[]; baixoEstoque:Array<{codigo:string;produto:string;quantidade:number;valor:number}>; }
