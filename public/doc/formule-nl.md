# Formules

De formules waarmee gerekend wordt.
Er zijn momenteel 6 verschillende formules die allemaal een ander resultaat geven.

In de onderstaande uitleg hebben de tekens ptN, ptNE en ptNW de volgende betekenis:

- pt: het punt dat berekend wordt
- ptN:  het punt direct boven pt (de voorgaande waarde voor deze positie)
- ptNE: het punt rechts van ptN
- ptNW: het punt links van ptN

### Formule 1

pt = ptN - 1 + 2 * abs(ptNW - ptNE)

### Formule 2

pt = abs(ptN - 1) * (1 + 2 * abs(ptNW - ptNE))

### Formule 3

pt = ptN - 1 + ptNW + ptNE

### Formule 4

pt = abs(ptN - 1) + 2 * (ptNW * ptNE)

### Formule 5

pt = abs(ptN - 1) + 3 * (ptNW + ptNE)

### Formule 6

pt = abs(ptN - 1) + 2 * (ptNW + ptNE)