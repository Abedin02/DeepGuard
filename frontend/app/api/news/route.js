export async function GET() {
  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    return Response.json(
      { status: 'error', error: 'NEWS_API_KEY is missing' },
      { status: 500 }
    )
  }

  const queries = [
    'deepfake scam',
    'deepfake fraud',
    'deepfake impersonation',
    'AI voice scam',
    'AI voice fraud',
    'voice cloning scam',
    'AI image scam',
    'AI video scam',
    'AI audio scam',
    'synthetic media scam',
  ]

  const scamTerms = [
    'scam',
    'scams',
    'fraud',
    'fraudulent',
    'impersonation',
    'impersonate',
    'extortion',
    'blackmail',
    'phishing',
    'deception',
    'fake',
  ]

  const aiMediaTerms = [
    'deepfake',
    'deepfakes',
    'ai voice',
    'artificial intelligence',
    'ai-generated',
    'synthetic media',
    'ai image',
    'ai video',
    'ai audio',
    'voice clone',
    'voice cloning',
  ]

  try {
    const requests = queries.map(async (query) => {
      const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(
        query
      )}&sort=newest&api-key=${apiKey}`

      const response = await fetch(url, {
        next: { revalidate: 3600 },
      })

      const data = await response.json()

      if (!response.ok) {
        return []
      }

      return data.response?.docs || []
    })

    const results = await Promise.all(requests)
    const docs = results.flat()

    const uniqueDocs = Array.from(
      new Map(docs.map((article) => [article.web_url, article])).values()
    )

    const filteredDocs = uniqueDocs.filter((article) => {
      const text = [
        article.headline?.main,
        article.snippet,
        article.abstract,
        article.lead_paragraph,
        article.keywords?.map((keyword) => keyword.value).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const hasScamContext = scamTerms.some((term) => text.includes(term))
      const hasAIMediaContext = aiMediaTerms.some((term) => text.includes(term))

      return hasScamContext && hasAIMediaContext
    })

    const finalDocs = filteredDocs.length > 0 ? filteredDocs : uniqueDocs

    const articles = finalDocs.slice(0, 4).map((article) => ({
      tag: article.section_name || article.source || 'NY TIMES',
      title: article.headline?.main || 'Untitled article',
      body:
        article.snippet ||
        article.abstract ||
        article.lead_paragraph ||
        'No description available.',
      stat: article.pub_date
        ? new Date(article.pub_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : 'Recent',
      statLabel: 'Published',
      link: article.web_url,
    }))

    return Response.json({
      status: 'ok',
      count: articles.length,
      articles,
    })
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        error: 'Server error while fetching NYT news',
      },
      { status: 500 }
    )
  }
}