// Simulation de ma base de données 
const userData = {
  profile: {
    name: 'Hugo',
    job: 'Ingénieur',
    location: 'Montréal, Québec',
    skills: ['JavaScript', 'React', 'Node.js', 'Git'],
    bio: 'Passionné par le développement web et en apprentissage constant!'
  },
  
  projects: [
    {
      id: 1,
      title: 'Mon Site Personnel',
      description: 'Site web créé avec React et Node.js',
      technologies: ['React', 'Node.js', 'Express']
    }
  ]
};

module.exports = userData;