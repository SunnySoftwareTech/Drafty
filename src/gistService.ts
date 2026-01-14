// GitHub Gist service for storing user data
// Stores books, projects, flashcards, and folders in a single private gist

const GIST_DESCRIPTION = 'Drafty App Data (Auto-sync)'
const GIST_FILENAME = 'drafty-data.json'

export interface GistData {
  books: any[]
  projects: any[]
  flashcards: any[]
  flashcardFolders: any[]
  lastSync: string
}

export class GistService {
  private token: string
  private gistId: string | null = null

  constructor(token: string) {
    this.token = token
  }

  // Find existing Drafty gist or return null
  private async findDraftyGist(): Promise<string | null> {
    try {
      const response = await fetch('https://api.github.com/gists', {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const gists = await response.json()
      const draftyGist = gists.find((g: any) => g.description === GIST_DESCRIPTION)
      
      return draftyGist?.id || null
    } catch (error) {
      console.error('Error finding Drafty gist:', error)
      throw error
    }
  }

  // Create a new gist for Drafty data
  private async createGist(data: GistData): Promise<string> {
    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: GIST_DESCRIPTION,
          public: false,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create gist: ${response.status}`)
      }

      const gist = await response.json()
      return gist.id
    } catch (error) {
      console.error('Error creating gist:', error)
      throw error
    }
  }

  // Update existing gist
  private async updateGist(gistId: string, data: GistData): Promise<void> {
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update gist: ${response.status}`)
      }
    } catch (error) {
      console.error('Error updating gist:', error)
      throw error
    }
  }

  // Save data to gist
  async save(data: GistData): Promise<void> {
    try {
      data.lastSync = new Date().toISOString()

      if (!this.gistId) {
        this.gistId = await this.findDraftyGist()
      }

      if (this.gistId) {
        await this.updateGist(this.gistId, data)
      } else {
        this.gistId = await this.createGist(data)
      }
    } catch (error) {
      console.error('Error saving to gist:', error)
      throw error
    }
  }

  // Load data from gist
  async load(): Promise<GistData | null> {
    try {
      if (!this.gistId) {
        this.gistId = await this.findDraftyGist()
      }

      if (!this.gistId) {
        return null
      }

      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load gist: ${response.status}`)
      }

      const gist = await response.json()
      const fileContent = gist.files[GIST_FILENAME]?.content

      if (!fileContent) {
        return null
      }

      return JSON.parse(fileContent) as GistData
    } catch (error) {
      console.error('Error loading from gist:', error)
      throw error
    }
  }

  // Test if token is valid
  static async testToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      return response.ok
    } catch (error) {
      return false
    }
  }
}
