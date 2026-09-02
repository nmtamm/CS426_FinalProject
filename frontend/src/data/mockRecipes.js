export const RECIPE_CATEGORIES = [
  "Tất cả",
  "Cơm & Mì",
  "Canh & Súp",
  "Thịt",
  "Hải sản",
  "Rau",
  "Bánh & Bánh mì",
  "Tráng miệng",
  "Đồ uống",
  "Đồ ăn vặt",
];

export const RECIPES = [
  {
    id: "recipe-1",
    title: "Cơm Tấm Sườn Nướng",
    category: "Cơm & Mì",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Sườn lợn", "Cơm tấm", "Trứng ốp", "Dưa chuột", "Cà chua"],
    seasoning: ["Tương cốt dừa", "Dầu mè", "Tiêu đen"],
    instructionLink: "https://example.com/recipe-1",
  },
  {
    id: "recipe-2",
    title: "Bánh Mì Thịt Nạc",
    category: "Bánh & Bánh mì",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Bánh mì", "Thịt nạc", "Dưa leo", "Cà rốt", "Hành"],
    seasoning: ["Tương cà chua", "Dầu ôliu"],
    instructionLink: "https://example.com/recipe-2",
  },
  {
    id: "recipe-3",
    title: "Phở Bò Nước Dùng",
    category: "Canh & Súp",
    image:
      "https://images.unsplash.com/photo-1612874742237-415221591ee3?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Bò thăn", "Bánh phở", "Hành hoa", "Xà lách", "Rau mùi"],
    seasoning: ["Nước tương", "Tỏi", "Ớt", "Nước cốt chanh"],
    instructionLink: "https://example.com/recipe-3",
  },
  {
    id: "recipe-4",
    title: "Gà Rán Giòn",
    category: "Thịt",
    image:
      "https://images.unsplash.com/photo-1626082058943-92103ef7acc8?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Gà tươi", "Tỏi", "Hạt tiêu", "Bột ngô", "Dầu ăn"],
    seasoning: ["Nước mắm", "Đường", "Muối"],
    instructionLink: "https://example.com/recipe-4",
  },
  {
    id: "recipe-5",
    title: "Tôm Sú Hấp Bia",
    category: "Hải sản",
    image:
      "https://images.unsplash.com/photo-1565958011504-98d6e9c869d8?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Tôm sú", "Bia", "Gừng", "Tỏi", "Hành"],
    seasoning: ["Nước mắm", "Tiêu", "Muối"],
    instructionLink: "https://example.com/recipe-5",
  },
  {
    id: "recipe-6",
    title: "Rau Muống Xào Tỏi",
    category: "Rau",
    image:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b8?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Rau muống", "Tỏi", "Ớt", "Dầu ăn"],
    seasoning: ["Nước mắm", "Muối"],
    instructionLink: "https://example.com/recipe-6",
  },
  {
    id: "recipe-7",
    title: "Bánh Flan Trứng Nước Cốt Dừa",
    category: "Tráng miệng",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291840?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Trứng gà", "Sữa đặc", "Nước cốt dừa", "Đường", "Caramel"],
    seasoning: ["Muối"],
    instructionLink: "https://example.com/recipe-7",
  },
  {
    id: "recipe-8",
    title: "Chè Đậu Xanh",
    category: "Đồ uống",
    image:
      "https://images.unsplash.com/photo-1590523277543-a78d1628e2b7?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Đậu xanh", "Nước cốt dừa", "Đường", "Nước lạnh"],
    seasoning: ["Muối"],
    instructionLink: "https://example.com/recipe-8",
  },
  {
    id: "recipe-9",
    title: "Nem Rán Cơm Chiều",
    category: "Đồ ăn vặt",
    image:
      "https://images.unsplash.com/photo-1600080869962-e3861e0dd1a5?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Nem", "Thịt nạc", "Dưa hành", "Cà rốt", "Tỏi"],
    seasoning: ["Nước mắm", "Tương ớt"],
    instructionLink: "https://example.com/recipe-9",
  },
  {
    id: "recipe-10",
    title: "Cơm Chiên Dương Châu",
    category: "Cơm & Mì",
    image:
      "https://images.unsplash.com/photo-1612874742237-415221591ee3?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Cơm cơn", "Trứng", "Tôm", "Duy hành", "Đậu Hà Lan"],
    seasoning: ["Nước mắm", "Dầu mè", "Tiêu"],
    instructionLink: "https://example.com/recipe-10",
  },
  {
    id: "recipe-11",
    title: "Mì Xào Thập Cẩm",
    category: "Cơm & Mì",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Mì vàng", "Thịt gà", "Tôm", "Dưa hành", "Rau các loại"],
    seasoning: ["Nước mắm", "Dầu ăn", "Tỏi"],
    instructionLink: "https://example.com/recipe-11",
  },
  {
    id: "recipe-12",
    title: "Canh Chua Cá",
    category: "Canh & Súp",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80",
    ingredients: ["Cá cơm", "Cà chua", "Khóm", "Dứa", "Rau muống"],
    seasoning: ["Nước mắm", "Me", "Tỏi", "Ớt"],
    instructionLink: "https://example.com/recipe-12",
  },
];
