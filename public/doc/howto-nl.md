# Gebruiksaanwijzing

CanticleJS is eenvoudig in het gebruik: klik de knop "Start opnieuw", en CanticleJS begint een nieuwe afbeelding te genereren. Pas de instellingen aan om andere beelden te maken. Je moet de start knop opnieuw aanklikken om nieuwe instellingen zoals aantal startpunten en niveaus te gebruiken, die hebben geen invloed op de afbeelding die in ontwikkeling is. Een aantal instellingen werken wel direct op de afbeelding in ontwikkeling, deze zijn met een <span class="icon">📍</span> icoon gemarkeerd.

Alle instellingen die je aanpast worden automatisch bewaard (op je eigen computer). De volgende keer dat je CanticleJS opent zijn de zelfde instellingen weer actief.

### Formule

De formule instelling bepaalt welk algoritme gebruikt wordt om de beelden te genereren. Kies een algoritme uit het dropdown menu en klik Start opnieuw om het uit te proberen. Momenteel zijn er 6 algoritmes om uit te kiezen. Zie onder de tab "Formule voor een toelichting op deze formules".

### Niveau zoeker

Onder het formule menu zie je een knop "Niveaus voor fomule n". Deze opent een venster met met een tabel waarin de resultaten van de gekozen formule met diverse niveaus worden weergegeven. Je ziet de levels, het aantal iteraties en het aantal herhalingen dat een combinatie oplevert. Alleen combinaties die minstens 100 iteraties halen komen voor in de lijst. Als een combinatie een hoog aantal herhalingen oplevert betekent dat dat het beeld zich snel herhaalt, meestal minder interessant. Alle combinaties zijn tot maximaal 20000 iteraties doorgerekend, dus veel combinaties hebben deze waarde in de kolom iteraties. Niveaus die veel herhaling hebben, of minder dan 500 iteraties halen zijn rood gemarkeerd in de lijst.

### Niveaus

Hier stel je het aantal niveaus in voor de gekozen formule. Daarmee bepaal je ook het aantal kleuren in de afbeelding.

### Aantal startpunten

Dit regelt het aantal startpunten die de maximale waarde krijgen (op de eerste regel).

### Random positie startpunten

Kruis dit aan om de startpunten willekeurig te verdelen over de eerste regel. Als dit uit staat worden de punten op regelmatige afstanden geplaatst.

### Randgedrag

Deze instelling bepaalt wat er gebeurt aan de randen (lins en rechts) van het beeld. Aangezien in die situatie ofwel ptNE ofwel ptNW ontbreekt, moet een waarde gekozen worden. Het effect van deze instelling is lastig uit te leggen, experimenteren is het devies. Deze instelling wordt direct overgenomen op een afbeelding die in ontwikkeling is.

### Scroll bij vol scherm

Als dit aan staat gaat het beeld omhoog scrollen als de onderkant van het scherm is bereikt. Anders gaat het beeld weer bovenaan verder en overschrijft het de vorige 'pagina'. Deze instelling wordt direct overgenomen op een afbeelding die in ontwikkeling is.

### Stop bij alleen 0 en 1

Dit bepaalt wat er gebeurt als de combinatie van formule en niveaus alleen waardes van 0 en 1 oplevert. Aangezien het beeld dan snel oninteressant wordt. Deze instelling wordt direct overgenomen op een afbeelding die in ontwikkeling is. Zet dit uit en klik de knop "Ga door" het renderen te hervatten als het gestopt is door deze instelling.

### (Max) Iteraties

Het aantal iteraties wordt lopend weergegeven bij "Iteraties:", De instelling "Max iteraties" bepaalt wanneer de berekening stopt. Stel dit in op 0 om oneindig door te laten rekenen. (tenzij de bovenstaande instelling aan staat en er alleen 0 and 1's gegenereerd worden). Deze instelling wordt direct overgenomen op een afbeelding die in ontwikkeling is. Zet dit op een hogere waarde (of op 0) en klik de knop "Ga door" het renderen te hervatten als het gestopt is door deze instelling.

### Pauzeer/Ga door

Als een beeld gerenderd wordt kun je de voortgang pauzeren met deze knop, Die verandert dan in een "Ga door" knop, klik die en het renderen gaat verder. Deze knop verandert ook in een Ga door knop als het genereren stopt om andere redenen.
Soms, als een render stopt omdat er alleen 0 en 1 gegenereerd wordt (en de instelling "Stop bij alleen 1 of 0" is aan) kun je de render weer op gang brengen door een paar maal op deze knop te klikken. Een combinatie waar dat gebeurt is Formule 1 met Niveaus 123.

### Kleuren

Klik op het kopje "Kleuren" om meer mogelijkheden te tonen voor de kleuren van de afbeelding. Er zijn een aantal kleurverlopen waar je uit kunt kiezen. Het aantal gegenereerde kleuren wordt bepaald door de instelling "Niveaus".

Daaronder kun je de achtergrond kleur kiezen, momenteel Zwart, Wit of Grijs. Deze instelling wordt direct overgenomen op een afbeelding die in ontwikkeling is.

De kleuren die gebruikt worden voor de afbeelding worden onder het beeld weergegeven in een balk. De eerste (meest linkse) kleur is de achtergrond kleur. De andere worden ontleend aan de gekozen gradient. The kleuren worden gegenereerd voordat de berekening start, en kunnen niet aangepast worden 'tijdens de rit'.