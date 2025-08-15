// GitHub API Service
class GitHubService {
  constructor() {
    this.config = GITHUB_CONFIG;
  }

  // Get the current SHA of the file
  async getFileSha() {
    try {
      const response = await fetch(
        `${this.config.API_BASE}/repos/${this.config.USERNAME}/${this.config.REPO}/contents/${this.config.PATH}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file SHA: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.sha;
    } catch (error) {
      console.error('Error getting file SHA:', error);
      throw error;
    }
  }

  // Update the menu.json file
  async updateMenuFile(content, message) {
    try {
      const sha = await this.getFileSha();
      const response = await fetch(
        `${this.config.API_BASE}/repos/${this.config.USERNAME}/${this.config.REPO}/contents/${this.config.PATH}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            message: message || this.config.COMMIT_MESSAGE,
            content: btoa(JSON.stringify(content, null, 2)),
            sha: sha,
            branch: this.config.BRANCH
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update file');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating menu file:', error);
      throw error;
    }
  }

  // Upload an image to the images directory
  async uploadImage(file, filename) {
    try {
      // Read the file as base64
      const base64Content = await this.readFileAsBase64(file);
      
      // Upload to GitHub
      const response = await fetch(
        `${this.config.API_BASE}/repos/${this.config.USERNAME}/${this.config.REPO}/contents/images/${filename}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            message: `Upload image: ${filename}`,
            content: base64Content.split(',')[1], // Remove the data URL part
            branch: this.config.BRANCH
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      return data.content.download_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Helper function to read file as base64
  readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

// Create a singleton instance
const githubService = new GitHubService();
