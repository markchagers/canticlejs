# Formulae

The formulae used to calculate.
Currently there are 6 different formulae that each produce different results

In the explanation below, the signs ptN, ptNE en ptNW have the following meaning:

- pt: the point being calculated
- ptN: the point directly above pt (the previous value for this position)
- ptNE: the point to the right of ptN
- ptNW: the point to the left of ptN



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