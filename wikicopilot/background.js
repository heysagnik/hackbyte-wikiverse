const CONTEXT_MENU_ITEMS = [
  { 
    id: 'analyze', 
    title: 'Analyze', 
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
  },
  { 
    id: 'optimize', 
    title: 'Optimize', 
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>'
  },
  { 
    id: 'research', 
    title: 'Deep Research', 
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
  }
];

function isWikipediaDomain(url) {
  return url && url.match(/^https?:\/\/([a-z0-9-]+\.)?wikipedia\.org\//i);
}

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items for Wikipedia domains only
  CONTEXT_MENU_ITEMS.forEach(item => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ['selection'],
      documentUrlPatterns: ["*://*.wikipedia.org/*"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  const action = info.menuItemId;
  
  if (selectedText && CONTEXT_MENU_ITEMS.some(item => item.id === action) && isWikipediaDomain(tab.url)) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'showFloatingPanel',
      selectedText,
      operation: action
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the request is from a Wikipedia domain
  if (sender.tab && !isWikipediaDomain(sender.tab.url)) {
    sendResponse({ success: false, error: "Wiki Copilot only works on Wikipedia domains" });
    return;
  }

  if (message.action === 'openSidebar') {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'openSidebar',
      selectedText: message.selectedText,
      operation: message.operation,
      result: message.result
    });
    sendResponse({ success: true });
  }
  
  if (message.action === 'processWithGemini') {
    processWithGemini(message.text, message.operation)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function processWithGemini(text, operation) {
  try {
    const API_KEY = 'AIzaSyCOrz_GqZrv1MIqev3oWnGkLEXsFs6l5VI'; // Replace with your actual API key
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    const prompt = getPromptForOperation(text, operation);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      contents: [{
        parts: [{
        text: prompt
        }]
      }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 8192
      }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error('Failed to process with Gemini API: ' + error.message);
  }
}

function getPromptForOperation(text, operation) {
  switch (operation) {
    case 'analyze':
      return `As a Wikipedia quality evaluator, thoroughly analyze this text against Wikipedia's core policies and guidelines:

        1. ASSESS compliance with key policies: 
       - Neutral Point of View (WP:NPOV): No bias, fairly represents all significant viewpoints, avoids stating opinions as facts
       - Verifiability (WP:V): All material must be attributable to reliable, published sources
       - No Original Research (WP:NOR): No unpublished facts, arguments, speculation, analysis or interpretation
       - Notability (WP:N): Topic must have received significant coverage in reliable sources independent of the subject
        
        2. EVALUATE adherence to guidelines:
       - Reliable Sources (WP:RS): Sources must have editorial oversight, reputation for accuracy, and fact-checking
       - Proper Citations (WP:CITE): Inline citations for direct quotations, statistics, and contentious materials
       - Encyclopedic Tone (WP:TONE): Formal, focused on facts, avoids promotional language and peacock terms
       - Structural Organization (WP:MOS): Logical sections, appropriate headings, consistent formatting
       - Conciseness (WP:CONCISE): Information presented efficiently without excessive detail
       - Biographies of Living Persons (WP:BLP): Requires higher scrutiny for accuracy and neutrality
       - Manual of Style (WP:MOS): Follows established conventions for clarity and consistency
       - No Weasel Words (WP:WEASEL): Avoids vague attributions like "some say" or "it is believed"
        
        3. For each violation, CITE the specific policy/guideline (with Wikipedia shortcut reference)
        
        4. PROVIDE specific examples from the text that violate each policy/guideline
        
        5. CALCULATE an overall accuracy score (1-10)
        
        6. RETURN actionable suggestions for improvement organized by policy/guideline
        
        Analyze this text:
        ${text}`;
    case 'optimize':
      return `As an experienced Wikipedia editor, optimize the following text to meet Wikipedia's highest standards:

    1. IMPROVE CONTENT by:
       - Ensuring neutral point of view (WP:NPOV): removing bias and opinion statements
       - Adding verifiability (WP:V): identifying claims needing citations
       - Eliminating original research (WP:NOR): removing unsourced analysis
       - Enhancing encyclopedic tone (WP:TONE): replacing informal language with formal, academic phrasing
       - Fixing organizational structure: improving headings, paragraph flow, and content hierarchy

    2. ADD REFERENCES:
       - Identify specific statements requiring citations
       - Suggest reliable sources (academic journals, books, reputable news outlets) for each claim
       - Format citations according to Wikipedia style guidelines
       - Replace any "citation needed" tags with proper references where possible

    3. FIX FORMATTING:
       - Add appropriate section headings if missing
       - Ensure proper use of lists, tables, and other formatting elements
       - Suggest image placements if relevant
       - Standardize date formats and units of measurement

    Return the optimized text with:
    1. The improved content
    2. A list of suggested references with URLs where available
    3. Specific explanations of major changes made

    Text to optimize:
    ${text}`;
    case 'research':
      return `As an advanced research assistant, conduct a thorough investigation on the following topic. Search across the entire internet for comprehensive information, including:

    1. COLLECT INFORMATION from:
       - Academic journals and scholarly publications
       - Reputable news sources and media outlets  
       - Historical archives and primary sources
       - Expert opinions and authoritative books
       - Official websites, databases, and reports
       - Encyclopedias and educational resources

    2. ANALYZE the collected information to:
       - Identify key facts, concepts, and principles
       - Trace historical development and evolution
       - Examine current understanding and state-of-the-art knowledge
       - Highlight different perspectives and interpretations
       - Uncover notable controversies, debates, and unresolved questions
       - Recognize significant figures, organizations, and events
       - Determine future trends and potential developments

    3. SYNTHESIZE findings into a well-structured Wikipedia article that includes:
       - A comprehensive introduction summarizing the topic
       - Multiple sections with appropriate headings and subheadings
       - Proper citations following Wikipedia's referencing guidelines
       - Neutral point of view (NPOV) presentation of all significant viewpoints
       - Clear, encyclopedic language accessible to a general audience
       - Relevant statistics, dates, and quantitative information
       - Notable quotes from recognized authorities (properly attributed)
       - Contextual information showing the topic's significance and impact

    4. INCLUDE a "References" section with properly formatted citations to:
       - Academic journals and peer-reviewed research
       - Books from respected publishers
       - Articles from reliable news sources
       - Official reports and primary documents
       - Authoritative websites with institutional backing

    Research this topic thoroughly and present your findings in Wikipedia article format:
    ${text}`;
    default:
      return `Process this text: ${text}`;
  }
}