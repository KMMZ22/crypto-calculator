#!/bin/bash

echo "🔧 Correction des redirections /auth..."

# Liste des fichiers à corriger
files=(
  "src/components/TradeGuardLanding.jsx"
  "src/pages/Landing.jsx" 
  "src/pages/Calculator.jsx"
  "src/pages/Dashboard.jsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Correction de $file"
    
    # Remplace /auth?plan= par /signup?plan=
    sed -i '' 's|/auth?plan=|/signup?plan=|g' "$file"
    
    # Remplace navigate('/auth?plan= par navigate('/signup?plan=
    sed -i '' "s|navigate('/auth?plan=|navigate('/signup?plan=|g" "$file"
    
    # Remplace navigate(\`/auth?plan= par navigate(\`/signup?plan=
    sed -i '' 's|navigate(`/auth?plan=|navigate(`/signup?plan=|g' "$file"
  else
    echo "⚠️  Fichier non trouvé: $file"
  fi
done

echo "✅ Toutes les redirections sont corrigées !"
