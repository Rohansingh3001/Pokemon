import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { allPokemonNames } from '../pokemonNames';
import Opening from './Opening';

function Home() {
  const [mode, setMode] = useState('search');
  const [searchName, setSearchName] = useState('pikachu');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Data, setPlayer1Data] = useState(null);
  const [player2Data, setPlayer2Data] = useState(null);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const fetchPokemonData = async (name, setData) => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setData(res.data);
    } catch (error) {
      setData(null);
      alert(`⚠️ Pokémon "${name}" not found.`);
    }
  };

  const handleBattle = () => {
    if (!player1Data || !player2Data) return;
    const total1 = player1Data.stats.reduce((sum, s) => sum + s.base_stat, 0);
    const total2 = player2Data.stats.reduce((sum, s) => sum + s.base_stat, 0);
    if (total1 > total2) setWinner('🔥 Player 1 Wins!');
    else if (total2 > total1) setWinner('⚡ Player 2 Wins!');
    else setWinner("🤝 It's a Draw!");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    fetchPokemonData(searchName, setSearchData);
    setSearchSuggestions([]);
  };

  if (isOpening) return <Opening />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-purple-200 px-6 py-4 font-sans">
      <motion.h1
        className="text-5xl font-extrabold text-center text-indigo-800 mb-8 drop-shadow-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        PokéDairy
      </motion.h1>

      <div className="flex justify-center gap-4 mb-8">
        {['search', 'battle'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-full transition-all duration-300 font-semibold shadow ${
              mode === m
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white scale-105'
                : 'bg-white border border-indigo-400 hover:bg-indigo-100'
            }`}
          >
            {m === 'search' ? 'Search Mode' : 'Battle Mode'}
          </button>
        ))}
      </div>

      {mode === 'search' && (
        <motion.div
          className="max-w-md mx-auto bg-white/90 p-6 rounded-2xl shadow-2xl backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              value={searchName}
              onChange={(e) => {
                const val = e.target.value;
                setSearchName(val);
                setSearchSuggestions(allPokemonNames.filter((n) =>
                  n.toLowerCase().startsWith(val.toLowerCase())
                ).slice(0, 5));
              }}
              placeholder="Search Pokémon"
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {searchSuggestions.length > 0 && (
              <ul className="absolute bg-white shadow rounded w-full mt-1 z-10">
                {searchSuggestions.map((s) => (
                  <li
                    key={s}
                    onClick={() => {
                      setSearchName(s);
                      fetchPokemonData(s, setSearchData);
                      setSearchSuggestions([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-100 rounded"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {searchData && (
            <div className="text-center mt-6">
              <img src={searchData.sprites.front_default} alt={searchData.name} className="w-28 mx-auto" />
              <h2 className="text-2xl font-bold capitalize mt-2">{searchData.name}</h2>
              <p className="text-sm text-gray-700"><strong>Type:</strong> {searchData.types.map(t => t.type.name).join(', ')}</p>
              <p className="text-sm text-gray-700"><strong>Abilities:</strong> {searchData.abilities.map(a => a.ability.name).join(', ')}</p>
              <div className="mt-4 text-left text-sm">
                <strong>Base Stats:</strong>
                <ul className="list-disc list-inside">
                  {searchData.stats.map(stat => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {mode === 'battle' && (
        <motion.div className="max-w-5xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {[{ p: player1, s: suggestions1, set: setPlayer1, setData: setPlayer1Data, setSug: setSuggestions1 },
              { p: player2, s: suggestions2, set: setPlayer2, setData: setPlayer2Data, setSug: setSuggestions2 }]
              .map(({ p, s, set, setData, setSug }, i) => (
              <div key={i}>
                <input
                  value={p}
                  onChange={(e) => {
                    const val = e.target.value;
                    set(val);
                    setSug(allPokemonNames.filter(name => name.toLowerCase().startsWith(val.toLowerCase())).slice(0, 5));
                  }}
                  placeholder={`Player ${i + 1} Pokémon`}
                  className="p-3 rounded-xl border w-64 shadow focus:ring-2 focus:ring-pink-300"
                />
                {s.length > 0 && (
                  <ul className="bg-white shadow rounded mt-1">
                    {s.map(name => (
                      <li
                        key={name}
                        onClick={() => {
                          set(name);
                          fetchPokemonData(name, setData);
                          setSug([]);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-pink-100"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={handleBattle} className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg shadow hover:scale-105 transition-transform">
              Battle!
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {[player1Data, player2Data].map((data, i) =>
              data && (
                <motion.div
                  key={data.name}
                  className="bg-white rounded-2xl p-6 w-72 shadow-lg text-center hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={data.sprites.front_default} alt={data.name} className="w-24 mx-auto" />
                  <h3 className="capitalize text-xl font-bold mt-2">{data.name}</h3>
                  <p className="text-sm text-gray-600"><strong>Type:</strong> {data.types.map(t => t.type.name).join(', ')}</p>
                  <ul className="text-sm mt-2 list-disc list-inside text-left">
                    {data.stats.map(stat => (
                      <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                    ))}
                  </ul>
                </motion.div>
              )
            )}
          </div>

          {winner && (
            <motion.div className="text-3xl font-bold text-center mt-8 text-green-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {winner}
            </motion.div>
          )}
        </motion.div>
      )}

      <footer className="text-center text-sm text-indigo-900 mt-10">
        Made with ❤️ using <a href="https://pokeapi.co" className="underline hover:text-indigo-600" target="_blank" rel="noopener noreferrer">PokeAPI</a>
      </footer>
    </div>
  );
}

export default Home;
