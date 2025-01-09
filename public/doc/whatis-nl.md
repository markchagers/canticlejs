# Wat is CanticleJS?

CanticleJS is de meest recente incarnatie van een programma om te experimenteren met het verschijnsel Cellulaire automaten. Eigenlijk is het alleen geschikt om interessante plaatjes te genereren.

Wikipedia heeft een goed artikel over [Cellulaire Automaten](https://wikipedia.org/wiki/Cellular_automaton). Ik kan niet beweren dat ik alle wiskunde achter dit artikel snap, maar ik ben dan ook voornamelijk geïnteresseerd in het maken van leuke afbeeldingen. Het type Cellulaire automaten waar CanticleJS mee werkt zouden ingedeeld moeten worden onder [Elementaire Cellulaire Automaten](https://wikipedia.org/wiki/Cellular_automaton#Elementary_cellular_automata) maar ze breken een aantal regels uit dat artikel.

CanticleJS genereert beelden beginnend met een regel (pixels), en genereert steeds de volgende regel op basis van die erboven en zo verder. Het berekent een numerieke waarde voor elke pixel met als input de waarde van de pixel erboven en die links en rechts daarvan. Door aan elke numerieke waarde een kleur toe te kennen ontstaat het beeld.

De eerste regel wordt geïnitialiseerd door een of meerdere pixels de maximale waarde te geven, de rest krijgt de waarde nul. Welke pixels de maximale waarde krijgen wordt bepaald door de instellingen. Via simpele algoritmes berekent CanticleJS de volgende regels. Het algoritme wordt bepaald door de "Formule" instelling.

Elke mogelijke waarde van een pixel wordt gerepresenteerd door een kleur uit het palet, het aantal kleuren en dus het aantal mogelijke waardes kan worden ingesteld via de "Niveaus" instelling. De invloed van deze instelling op het resulterende plaatje is zeer groot. Sommige combinaties van formule en niveaus geven nauwelijks resultaat en andere combinaties produceren de wonderlijkste beelden.

Hoewel de gegenereerde beelden ontstaan uit een eindig aantal initiële condities, worden ze al snel tamelijk onvoorspelbaar, zonder daarbij volledig chaotisch te worden. Dit vind ik het meest intrigerende aspect van dit fenomeen. Niettemin is deze onvoorspelbaarheid nogal bedriegelijk: het is makkelijk aan te tonen dat twee beelden die met dezelfde instellingen gemaakt zijn identieke resultaten opleveren.

