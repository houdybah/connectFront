import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, timeout, retry } from 'rxjs/operators';
import { Realisation } from '../models/Realisation';
import { Unite } from '../models/Unite';
import {environment} from "../../../environments/environment";

export interface AnalysisConfig {
  provider: 'openai' | 'huggingface' | 'ollama' | 'anthropic' | 'google' | 'cohere';
  apiKey?: 'XXXXXXXXXXXXXXXXXXXXXX';
  apiUrl?: string;
  model?: string;
}

export interface AIResponse {
  analysis: string;
  insights: string[];
  recommendations: string[];
}

export interface AnalysisRequest {
  data: Realisation[];
  unite: Unite;
  periode: string;
  debut: string;
  fin: string;
  language?: string;
  analysisType?: 'basic' | 'detailed' | 'predictive';
}

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {

  private readonly API_TIMEOUT = 30000; // 30 secondes
  private readonly MAX_RETRIES = 2;

  private readonly defaultConfig: AnalysisConfig = {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: 'XXXXXXXXXXXXXXXXXXXXXX'
  };


  private readonly providerConfigs = {
    openai: {
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      models: ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4'],
      headers: (apiKey: string) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      })
    },
    huggingface: {
      baseUrl: 'https://api-inference.huggingface.co/models/',
      models: [
        'mistralai/Mistral-7B-Instruct-v0.3',
        'microsoft/DialoGPT-large',
        'facebook/blenderbot-400M-distill'
      ],
      headers: (apiKey: string) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      })
    },
    google: {
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
      models: ['gemini-pro', 'gemini-pro-vision'],
      headers: () => ({
        'Content-Type': 'application/json'
      })
    },
    anthropic: {
      baseUrl: 'https://api.anthropic.com/v1/messages',
      models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229'],
      headers: (apiKey: string) => ({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      })
    },
    cohere: {
      baseUrl: 'https://api.cohere.ai/v1/generate',
      models: ['command', 'command-light'],
      headers: (apiKey: string) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      })
    },
    ollama: {
      baseUrl: 'http://localhost:11434/api/generate',
      models: ['llama2', 'llama3', 'mistral', 'codellama'],
      headers: () => ({
        'Content-Type': 'application/json'
      })
    }
  };

  constructor(private http: HttpClient) {}


  analyzeRealisationData(request: AnalysisRequest, config?: AnalysisConfig): Observable<string> {
    if (!request.data || request.data.length === 0) {
      return throwError(() => new Error('Aucune donnée à analyser.'));
    }

    const analysisConfig = { ...this.defaultConfig, ...config };
    const prompt = this.buildAnalysisPrompt(request);

    console.log(`Démarrage analyse avec ${analysisConfig.provider}...`);
    return this.callAIProvider(prompt, analysisConfig)
        .pipe(
            timeout(this.API_TIMEOUT),
            retry(this.MAX_RETRIES),
            map(response => this.formatAIResponse(response, analysisConfig.provider)),
            catchError(error => this.handleAnalysisError(error, prompt))
        );
  }

  private callAIProvider(prompt: string, config: AnalysisConfig): Observable<string> {
    switch (config.provider) {
      case 'openai':
        return this.callOpenAI(prompt, config);
      case 'huggingface':
        return this.callHuggingFace(prompt, config);
      case 'google':
        return this.callGoogleAI(prompt, config);
      case 'anthropic':
        return this.callAnthropic(prompt, config);
      case 'cohere':
        return this.callCohere(prompt, config);
      case 'ollama':
        return this.callOllama(prompt, config);
      default:
        return throwError(() => new Error(`Fournisseur non supporté: ${config.provider}`));
    }
  }

  private callOpenAI(prompt: string, config: AnalysisConfig): Observable<string> {
    const apiKey = config.apiKey || environment.openaiApiKey;
    console.log(apiKey)
    if (!apiKey) {
      return throwError(() => new Error('Clé API OpenAI manquante'));
    }

    `Bearer : ${this.providerConfigs.openai.headers(apiKey)}`

    const headers = new HttpHeaders(this.providerConfigs.openai.headers(apiKey));
    const model = config.model || 'gpt-4o-mini';

    const body = {
      model,
      messages: [
        {
          role: 'system',
          content: `Vous êtes un expert en analyse financière spécialisé dans les données douanières. 
                   Analysez les données fournies et générez un rapport HTML professionnel en français.
                   Utilisez des classes Bootstrap pour le styling et incluez des graphiques textuels si pertinent.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    };

    return this.http.post<any>(this.providerConfigs.openai.baseUrl, body, { headers })
        .pipe(
            map(response => {
              if (response.choices && response.choices.length > 0) {
                return response.choices[0].message.content;
              }
              throw new Error('Réponse invalide d\'OpenAI');
            })
        );
  }

  private callHuggingFace(prompt: string, config: AnalysisConfig): Observable<string> {
    const apiKey = config.apiKey || environment.huggingfaceApiKey;
    if (!apiKey) {
      console.warn('Clé API Hugging Face manquante, utilisation sans authentification');
    }

    const model = config.model || 'mistralai/Mistral-7B-Instruct-v0.3';
    const url = `${this.providerConfigs.huggingface.baseUrl}${model}`;

    const headers = apiKey ?
        new HttpHeaders(this.providerConfigs.huggingface.headers(apiKey)) :
        new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      inputs: this.optimizePromptForHuggingFace(prompt),
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false,
        repetition_penalty: 1.1,
        top_p: 0.9,
        top_k: 40
      },
      options: {
        wait_for_model: true,
        use_cache: false
      }
    };

    return this.http.post<any>(url, body, { headers })
        .pipe(
            map(response => {
              if (Array.isArray(response) && response.length > 0) {
                return response[0].generated_text || response[0].text || '';
              } else if (response.generated_text) {
                return response.generated_text;
              }
              throw new Error('Réponse invalide de Hugging Face');
            })
        );
  }


  private callGoogleAI(prompt: string, config: AnalysisConfig): Observable<string> {
    const apiKey = config.apiKey || environment.googleAIKey;
    if (!apiKey) {
      return throwError(() => new Error('Clé API Google AI manquante'));
    }

    const model = config.model || 'gemini-pro';
    const url = `${this.providerConfigs.google.baseUrl}${model}:generateContent?key=${apiKey}`;
    const headers = new HttpHeaders(this.providerConfigs.google.headers());

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    return this.http.post<any>(url, body, { headers })
        .pipe(
            map(response => {
              if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                  return candidate.content.parts[0].text;
                }
              }
              throw new Error('Réponse invalide de Google AI');
            })
        );
  }


  private callAnthropic(prompt: string, config: AnalysisConfig): Observable<string> {
    const apiKey = config.apiKey || environment.anthropicApiKey;
    if (!apiKey) {
      return throwError(() => new Error('Clé API Anthropic manquante'));
    }

    const headers = new HttpHeaders(this.providerConfigs.anthropic.headers(apiKey));
    const model = config.model || 'claude-3-haiku-20240307';

    const body = {
      model,
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.7
    };

    return this.http.post<any>(this.providerConfigs.anthropic.baseUrl, body, { headers })
        .pipe(
            map(response => {
              if (response.content && response.content.length > 0) {
                return response.content[0].text;
              }
              throw new Error('Réponse invalide d\'Anthropic');
            })
        );
  }


  private callCohere(prompt: string, config: AnalysisConfig): Observable<string> {
    const apiKey = config.apiKey || environment.cohereApiKey;
    if (!apiKey) {
      return throwError(() => new Error('Clé API Cohere manquante'));
    }

    const headers = new HttpHeaders(this.providerConfigs.cohere.headers(apiKey));
    const model = config.model || 'command';

    const body = {
      model,
      prompt,
      max_tokens: 2000,
      temperature: 0.7,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    };

    return this.http.post<any>(this.providerConfigs.cohere.baseUrl, body, { headers })
        .pipe(
            map(response => {
              if (response.generations && response.generations.length > 0) {
                return response.generations[0].text;
              }
              throw new Error('Réponse invalide de Cohere');
            })
        );
  }


  private callOllama(prompt: string, config: AnalysisConfig): Observable<string> {
    const url = config.apiUrl || this.providerConfigs.ollama.baseUrl;
    const headers = new HttpHeaders(this.providerConfigs.ollama.headers());
    const model = config.model || 'llama2';

    const body = {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        repeat_penalty: 1.1
      }
    };

    return this.http.post<any>(url, body, { headers })
        .pipe(
            map(response => {
              if (response.response) {
                return response.response;
              }
              throw new Error('Réponse invalide d\'Ollama');
            })
        );
  }


  private buildAnalysisPrompt(request: AnalysisRequest): string {
    const { data, unite, periode, debut, fin } = request;

    // Calculs statistiques
    const stats = this.calculateStatistics(data);
    const trends = this.analyzeTrends(data);
    const anomalies = this.detectAnomalies(data);

    return `
# ANALYSE FINANCIÈRE DOUANIÈRE

## CONTEXTE
- **Unité**: ${unite.nomUnite} (${unite.codeUnite}) - ${unite.typeUnite}
- **Période**: ${periode} du ${debut} au ${fin}
- **Nombre d'enregistrements**: ${data.length}

## DONNÉES AGRÉGÉES
- **Total Recettes PP**: ${stats.totalRecettesPP.toLocaleString()} FG
- **Total Recettes AP**: ${stats.totalRecettesAP.toLocaleString()} FG
- **Total TME**: ${stats.totalTME.toLocaleString()} FG
- **Total TMX**: ${stats.totalTMX.toLocaleString()} FG
- **Total RER**: ${stats.totalRER.toLocaleString()} FG
- **TOTAL GÉNÉRAL**: ${stats.totalGeneral.toLocaleString()} FG

## INDICATEURS
- **Évolution**: ${trends.evolution} (${trends.percentage}%)
- **Ratio AP/PP**: ${stats.ratioAPPP.toFixed(2)}
- **Moyenne journalière**: ${stats.moyenneGeneral.toLocaleString()} FG
- **Anomalies détectées**: ${anomalies.length}

## INSTRUCTION
Générez un rapport HTML professionnel avec:
1. **Résumé exécutif** avec graphiques textuels
2. **Analyse détaillée** par catégorie de recettes
3. **Tendances et évolutions** avec interprétation
4. **Identification des anomalies** et explications
5. **Comparaisons et ratios** clés
6. **Recommandations stratégiques** concrètes
7. **Indicateurs de performance** (KPI)

Format: HTML avec classes Bootstrap, prêt pour affichage web.
Langue: Français professionnel.
`;
  }


  private optimizePromptForHuggingFace(prompt: string): string {
    return `<s>[INST] Tu es un expert financier. Analyse ces données douanières et génère un rapport HTML en français:

${prompt}

Réponds uniquement avec du HTML structuré et professionnel. [/INST]`;
  }


  private calculateStatistics(data: Realisation[]) {
    const totalRecettesPP = data.reduce((sum, item) => sum + (item.recettePP || 0), 0);
    const totalRecettesAP = data.reduce((sum, item) => sum + (item.recetteAP || 0), 0);
    const totalTME = data.reduce((sum, item) => sum + (item.tme || 0), 0);
    const totalTMX = data.reduce((sum, item) => sum + (item.tmx || 0), 0);
    const totalRER = data.reduce((sum, item) => sum + (item.rer || 0), 0);
    const totalGeneral = data.reduce((sum, item) => sum + (item.totalPPAPTMERER || 0), 0);

    return {
      totalRecettesPP,
      totalRecettesAP,
      totalTME,
      totalTMX,
      totalRER,
      totalGeneral,
      moyenneGeneral: totalGeneral / data.length,
      ratioAPPP: totalRecettesPP > 0 ? totalRecettesAP / totalRecettesPP : 0
    };
  }


  private analyzeTrends(data: Realisation[]) {
    if (data.length < 2) {
      return { evolution: 'stable', percentage: 0 };
    }

    const firstValue = data[0].totalPPAPTMERER || 0;
    const lastValue = data[data.length - 1].totalPPAPTMERER || 0;
    const percentage = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

    let evolution = 'stable';
    if (percentage > 5) evolution = 'croissante';
    else if (percentage < -5) evolution = 'décroissante';

    return { evolution, percentage: Math.round(percentage * 100) / 100 };
  }


  private detectAnomalies(data: Realisation[]) {
    const moyenne = data.reduce((sum, item) => sum + (item.totalPPAPTMERER || 0), 0) / data.length;
    const seuil = moyenne * 0.5; // 50% d'écart

    return data.filter(item =>
        Math.abs((item.totalPPAPTMERER || 0) - moyenne) > seuil
    );
  }


  private formatAIResponse(text: string, provider: string): string {
    let cleanedText = text.trim();

    const htmlMatch = cleanedText.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
    if (htmlMatch) {
      cleanedText = htmlMatch[0];
    }

    if (!cleanedText.includes('<div') && !cleanedText.includes('<html')) {
      cleanedText = `
        <div class="ai-analysis-result">
          <div class="alert alert-info mb-3">
            <div class="d-flex align-items-center">
              <i class="fas fa-robot me-2"></i>
              <strong>Analyse générée par ${this.getProviderDisplayName(provider)}</strong>
            </div>
          </div>
          <div class="analysis-content">
            ${cleanedText.replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
    }

    if (!cleanedText.includes('analysis-footer')) {
      cleanedText += `
        <div class="analysis-footer mt-4">
          <div class="alert alert-secondary">
            <small class="text-muted">
              <i class="fas fa-info-circle me-1"></i>
              Analyse générée par ${this.getProviderDisplayName(provider)} • 
              ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </small>
          </div>
        </div>
      `;
    }

    return cleanedText;
  }


  private handleAnalysisError(error: any, originalPrompt: string): Observable<string> {
    console.error('Erreur lors de l\'analyse IA:', error);

    let errorMessage = 'Erreur de communication avec le service d\'IA';

    if (error.name === 'TimeoutError') {
      errorMessage = 'Délai d\'attente dépassé. Le service IA met trop de temps à répondre.';
    } else if (error.status === 401) {
      errorMessage = 'Authentification échouée. Vérifiez votre clé API.';
    } else if (error.status === 429) {
      errorMessage = 'Limite de requêtes atteinte. Veuillez patienter avant de réessayer.';
    } else if (error.status === 503) {
      errorMessage = 'Service temporairement indisponible. Modèle en cours de chargement.';
    }

    return of(this.generateFallbackAnalysis(originalPrompt, errorMessage));
  }


  private generateFallbackAnalysis(prompt: string, errorMessage: string): string {
    const uniteMatch = prompt.match(/\*\*Unité\*\*: ([^(]+)/);
    const periodeMatch = prompt.match(/\*\*Période\*\*: ([^\n]+)/);
    const totalMatch = prompt.match(/\*\*TOTAL GÉNÉRAL\*\*: ([^\n]+)/);

    const uniteName = uniteMatch ? uniteMatch[1].trim() : 'Unité analysée';
    const periode = periodeMatch ? periodeMatch[1].trim() : 'Période analysée';
    const totalGeneral = totalMatch ? totalMatch[1].trim() : 'N/A';

    return `
      <div class="fallback-analysis">
        <div class="alert alert-warning mb-4">
          <div class="d-flex">
            <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
            <div>
              <strong>Service IA temporairement indisponible</strong><br>
              <small>${errorMessage}</small>
            </div>
          </div>
        </div>

        <div class="analysis-header mb-4">
          <h4 class="text-primary">Analyse Financière de Base</h4>
          <h5 class="text-secondary">${uniteName}</h5>
          <p class="text-muted">${periode}</p>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card border-primary">
              <div class="card-header bg-primary text-white">
                <h6 class="mb-0">Recettes Totales</h6>
              </div>
              <div class="card-body text-center">
                <h4 class="text-primary">${totalGeneral}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-success">
              <div class="card-header bg-success text-white">
                <h6 class="mb-0">Statut de l'Analyse</h6>
              </div>
              <div class="card-body text-center">
                <h5 class="text-success">DONNÉES TRAITÉES</h5>
                <small class="text-muted">Analyse de base disponible</small>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h6 class="text-info">Observations Générales</h6>
            <ul class="list-group mb-3">
              <li class="list-group-item">Données financières collectées et agrégées</li>
              <li class="list-group-item">Suivi des recettes PP, AP, TME, TMX et RER</li>
              <li class="list-group-item">Calculs des totaux et moyennes effectués</li>
              <li class="list-group-item">Prêt pour analyse approfondie dès rétablissement du service</li>
            </ul>
          </div>
        </div>

        <div class="alert alert-info">
          <h6 class="alert-heading">Recommandations</h6>
          <ul class="mb-0">
            <li>Vérifiez la configuration de votre service d'IA</li>
            <li>Réessayez l'analyse dans quelques instants</li>
            <li>Contactez l'administrateur si le problème persiste</li>
            <li>Les données restent disponibles pour export Excel/PDF</li>
          </ul>
        </div>
      </div>
    `;
  }


  private getProviderDisplayName(provider: string): string {
    const names = {
      'openai': 'OpenAI GPT',
      'huggingface': 'Hugging Face',
      'google': 'Google Gemini',
      'anthropic': 'Anthropic Claude',
      'cohere': 'Cohere',
      'ollama': 'Ollama (Local)'
    };
    return names[provider as keyof typeof names] || provider;
  }


  testConnection(config: AnalysisConfig): Observable<boolean> {
    console.log(`Test de connexion avec ${config.provider}...`);

    const testRequest: AnalysisRequest = {
      data: [{} as Realisation],
      unite: { nomUnite: 'Test', codeUnite: 'TEST', typeUnite: 'TEST' } as Unite,
      periode: 'TEST',
      debut: '2024-01-01',
      fin: '2024-01-01'
    };

    return this.analyzeRealisationData(testRequest, config)
        .pipe(
            map(() => {
              console.log(`Connexion réussie avec ${config.provider}`);
              return true;
            }),
            catchError(error => {
              console.log(`Échec connexion avec ${config.provider}:`, error.message);
              return of(false);
            })
        );
  }


  getAvailableModels(provider: string): string[] {
    return this.providerConfigs[provider as keyof typeof this.providerConfigs]?.models || [];
  }

  async analyzeData(analysisData: any[], config: AnalysisConfig) {
    
  }
}






