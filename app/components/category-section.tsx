interface Category {
  name: string;
  prices: number[];
}

interface CategorySectionProps {
  category: Category;
  onAddToCart: (category: string, price: number) => void;
}

export function CategorySection({ category, onAddToCart }: CategorySectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e9ecef]">
      <h3 className="mb-4 text-[#495057]">{category.name}</h3>
      <div className="grid grid-cols-5 gap-2">
        {category.prices.map((price) => (
          <button
            key={price}
            onClick={() => onAddToCart(category.name, price)}
            className="aspect-square rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] text-white hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center gap-1"
          >
            <span>{price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}