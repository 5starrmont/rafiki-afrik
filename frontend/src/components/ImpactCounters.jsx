export default function ImpactCounters() {
  const stats = [
    { id: 1, label: 'Podcasts Produced', value: '45+' },
    { id: 2, label: 'Films Produced', value: '12' },
    { id: 3, label: 'Articles Published', value: '120+' },
    { id: 4, label: 'Community Conversations', value: '30+' },
    { id: 5, label: 'Countries Reached', value: '15' },
    { id: 6, label: 'Strategic Partnerships', value: '8' },
  ]

  return (
    <section className="py-20 px-6 bg-white text-primary">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-primary">
          Our Impact in Numbers
        </h2>
        <div className="w-16 h-1 bg-secondary mx-auto mb-16"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-heading font-bold text-secondary mb-2">
                {stat.value}
              </span>
              <span className="font-body text-sm md:text-base text-gray-600 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}