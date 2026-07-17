const ArticleCard = ({ article }) => {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      {article.featured_image && (
        <img 
          src={article.featured_image} 
          alt={article.title} 
          className="w-full h-52 object-cover"
        />
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-secondary font-semibold uppercase tracking-wider">
            {article.category?.name}
          </span>
          <span className="text-gray-500">{article.reading_time}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-primary line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm mt-auto border-t border-gray-100 pt-4">
          <span className="font-medium text-tertiary">By {article.author}</span>
          <span className="text-gray-400">
            {new Date(article.published_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;