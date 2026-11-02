export type Dish = { name: string; desc: string; price: number };
export type Section = { title: string; items: Dish[] };

export const menu: Section[] = [
  { title: "Entradas", items: [
    { name: "Pastel de feira", desc: "Massa crocante, recheio de carne seca e queijo coalho", price: 32 },
    { name: "Bolinho de mandioca", desc: "Com recheio de queijo e geleia de pimenta", price: 29 },
    { name: "Salada da horta", desc: "Folhas, palmito pupunha, castanha e vinagrete de maracujá", price: 34 },
  ]},
  { title: "Pratos principais", items: [
    { name: "Feijoada da casa", desc: "Arroz, couve, farofa, laranja e torresmo", price: 68 },
    { name: "Moqueca de peixe", desc: "Peixe do dia, leite de coco, dendê, arroz e pirão", price: 89 },
    { name: "Picanha na brasa", desc: "Com farofa de banana e vinagrete", price: 96 },
    { name: "Risoto de abóbora", desc: "Abóbora cabotiá, sálvia e queijo canastra", price: 62 },
  ]},
  { title: "Sobremesas", items: [
    { name: "Pudim de leite", desc: "Receita da vó, calda de caramelo", price: 22 },
    { name: "Goiabada com queijo", desc: "Goiabada cascão quente e queijo minas", price: 24 },
  ]},
  { title: "Bebidas", items: [
    { name: "Caipirinha", desc: "Limão, cachaça artesanal", price: 28 },
    { name: "Suco natural", desc: "Laranja, maracujá ou abacaxi com hortelã", price: 14 },
  ]},
];

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
