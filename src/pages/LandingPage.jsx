import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Users, Trophy, Calendar, Target } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar isLanding={true} />

      {/* Hero Section */}
      <section id="accueil" className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Libérez votre
                <span className="text-neon-green"> Potentiel Sportif</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Rejoignez le club de volleyball le plus dynamique de la région. Entraînez-vous avec
                les meilleurs, progressez rapidement et vivez votre passion à fond.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary flex items-center space-x-2">
                  <span>Nous rejoindre</span>
                  <ArrowRight size={20} />
                </a>
                <a href="#trainings" className="btn-secondary">
                  Découvrir les entraînements
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-8">
                <div>
                  <p className="text-4xl font-bold text-neon-green">500+</p>
                  <p className="text-gray-400">Membres actifs</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-neon-green">15+</p>
                  <p className="text-gray-400">Années d'expérience</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-neon-green/20 to-transparent rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600"
                  alt="Volleyball"
                  className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-neon-green/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Transformez votre <span className="text-neon-green">Parcours Volleyball</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nous offrons des programmes d'entraînement personnalisés pour vous aider à atteindre vos
              objectifs sportifs, que vous soyez débutant ou compétiteur confirmé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: 'Équipes Dynamiques',
                description: 'Rejoignez des équipes compétitives adaptées à votre niveau',
              },
              {
                icon: Trophy,
                title: 'Compétitions',
                description: 'Participez à des tournois régionaux et nationaux',
              },
              {
                icon: Calendar,
                title: 'Entraînements Réguliers',
                description: 'Sessions hebdomadaires avec des coaches professionnels',
              },
              {
                icon: Target,
                title: 'Suivi Personnalisé',
                description: 'Statistiques et analyses de vos performances',
              },
            ].map((feature, index) => (
              <div key={index} className="card text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-neon-green" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainings Section */}
      <section id="trainings" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Nos <span className="text-neon-green">Équipes</span>
            </h2>
            <p className="text-xl text-gray-400">Trouvez l'équipe qui vous correspond</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'U18 Masculin', level:'Compétition', schedule: 'Lundi & Jeudi 18h-20h' },
              { name: 'Seniors Féminin', level: 'Loisir & Compétition', schedule: 'Mardi & Vendredi 19h-21h' },
              { name: 'Vétérans Mixte', level: 'Loisir', schedule: 'Samedi 15h-17h' },
              ].map((team, index) => (
              <div key={index} className="card hover:scale-105 transition-transform duration-300">
              <div className="h-48 bg-gradient-to-br from-neon-green/20 to-transparent rounded-lg mb-4 flex items-center justify-center">
              <Users size={64} className="text-neon-green" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
              <p className="text-neon-green mb-2">{team.level}</p>
              <p className="text-gray-400">{team.schedule}</p>
              <a href="#contact" className="mt-4 btn-secondary w-full text-center block">
              S'informer
              </a>
           </div>
              ))}
          </div>
         </div>
       </section>
{/* Matches Section */}
  <section id="matches" className="py-20 bg-dark-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Matchs & <span className="text-neon-green">Compétitions</span>
        </h2>
        <p className="text-xl text-gray-400">Suivez nos performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            date: '15 Décembre 2024',
            team1: 'VolleyClub A',
            team2: 'Paris Volley',
            score: '3-1',
            status: 'Victoire',
          },
          {
            date: '22 Décembre 2024',
            team1: 'Lyon Volley',
            team2: 'VolleyClub A',
            score: '1-3',
            status: 'Victoire',
          },
        ].map((match, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">{match.date}</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                {match.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-white font-semibold mb-2">{match.team1}</p>
              </div>
              <div className="px-6">
                <p className="text-3xl font-bold text-neon-green">{match.score}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-white font-semibold mb-2">{match.team2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Contact Section */}
  <section id="contact" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Prêt à <span className="text-neon-green">commencer</span> ?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Rejoignez notre communauté de passionnés de volleyball
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="btn-primary">
            Se connecter
          </Link>
          <a href="mailto:contact@volleyclub.fr" className="btn-secondary">
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  </section>

  <Footer />
 </div>
 );
};

export default LandingPage;