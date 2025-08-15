// GitHub API Configuration
const GITHUB_CONFIG = {
  USERNAME: 'MOREQASSE',
  REPO: 'Dahar.Coffee',
  BRANCH: 'main',
  PATH: 'data/menu.json',
  COMMIT_MESSAGE: 'Update menu via admin panel',
  API_BASE: 'https://api.github.com',
  // This token should be kept secret and not committed to version control
  // In a production environment, this should be handled more securely
  TOKEN: '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'
};

// This will be used to make authenticated requests
function getAuthHeaders() {
  return {
    'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
}
