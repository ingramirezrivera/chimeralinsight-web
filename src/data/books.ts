// src/data/books.ts
export type Availability = "available" | "upcoming";

export interface Retailer {
  id: string; // ej. "amazon", "amazon-uk"
  label: string; // texto del botón
  url: string; // enlace del retailer
}

export interface BookData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  about?: string;
  coverSrc: string;
  amazonUrl?: string; // opcional (legacy)
  retailers: Retailer[]; // NUEVO
  availability?: Availability; // NUEVO (si falta, trátalo como "available")
  releaseDate?: string; // NUEVO (ISO, p.ej. "2025-12-01" cuando upcoming)
}

export const books: BookData[] = [
  {
    id: "tao",
    title: "The Tao of The Thirteenth God",
    subtitle: "A Paranormal Thriller",
    description:
      "They all drank the Kool-Aid and one thousand people died. Amadeus and Theo Savoie are twins, estranged for years, the products of a childhood torn apart by religion, abandonment and suicide. With his partner, Dr. Angelica Pali, Amadeus sifts through a maze of religious rituals with all signs pointing to the convergence of a religious and...",
    coverSrc: "/images/books/the-tao-of-the-thirteenth-good.jpg",
    amazonUrl: "https://www.amazon.com/dp/0987772015",
    retailers: [
      {
        id: "amazon",
        label: "Amazon",
        url: "https://www.amazon.com/dp/0987772015",
      },
      {
        id: "amazon-uk",
        label: "Amazon UK",
        url: "https://www.amazon.co.uk/dp/0987772015",
      },
      {
        id: "amazon-ca",
        label: "Amazon CA",
        url: "https://www.amazon.ca/dp/0987772015",
      },
      {
        id: "amazon-AU",
        label: "Amazon AU",
        url: "https://www.amazon.com.au/dp/0987772015",
      },
    ],
    about: `They all drank the Kool-Aid and one thousand people died.

Amadeus and Theo Savoie are twins, estranged for years, the products of a childhood torn apart by religion, abandonment and suicide.

With his partner, Dr. Angelica Pali, Amadeus sifts through a maze of religious rituals with all signs pointing to the convergence of a religious and scientific global calamity. Using a shamanic rite, Amadeus has 'contacted' his deceased sister, Sophia, and begins an investigation into a mass suicide cult in Belize, a cult ready to confront the end of the world.

Superstition, coded messages and drug induced visions of the dead, combine to create a paranormal thriller, the story of a final apocalypse. Who can survive? Will it only be the chosen ones? Can the dead Sophia steer humanity away from the End Days? Can she shield us from an imminent celestial Doomsday?`,
  },
  {
    id: "vaccine",
    title: "Vaccine",
    subtitle: "A Terrorism Thriller",
    description:
      "War kills in many ways—with speed, with brutality…with stealth. At the end of the 20th century, America prepares for a war that could transform the world. But that war has already been fought. . .and America has lost. In the lingering chaos of the Middle East conflict, a pathogen is unleashed. This plague has been engineered to suffocate its...",
    coverSrc: "/images/books/vaccine.jpg",
    amazonUrl: "https://www.amazon.com/dp/B009596W5O",
    retailers: [
      {
        id: "amazon",
        label: "Amazon",
        url: "https://www.amazon.com/dp/B009596W5O",
      },
      {
        id: "amazon-uk",
        label: "Amazon UK",
        url: "https://www.amazon.co.uk/dp/B009596W5O",
      },
      {
        id: "amazon-ca",
        label: "Amazon CA",
        url: "https://www.amazon.ca/dp/B009596W5O",
      },
      {
        id: "amazon-AU",
        label: "Amazon AU",
        url: "https://www.amazon.com.au/dp/B009596W5O",
      },
    ],
    about: `War kills in many ways—with speed, with brutality…with stealth.
At the end of the 20th century, America prepares for a war that could transform the world. But that war has already been fought...and America has lost. In the lingering chaos of the Middle East conflict, a pathogen is unleashed. This plague has been engineered to suffocate its victims with an agonizing, sleepless death and cripple the victor long after the battle has ended.
Darien Rhodes, once an esteemed military physician, is now a disgraced exile. Forced back into service by the army that had betrayed him, he searches for the cure held in the hands of the enemy.
Racing against time, Rhodes faces an unforgiving ultimatum: find the vaccine…or face a trial for treason.
Blackmail, bioterror, deception—an electrifying terrorism thriller that merges the intensity of military and medical suspense. Will America survive this final blow?`,
  },
  {
    id: "whip",
    title: "Whip The Dogs",
    subtitle: "An Addiction Thriller",
    description:
      "The Weapons of War are Always Changing. In the real world, clandestine scientific research has already created UNNATURAL BORN KILLERS, super soldiers, genetically modified killing machines. In America, Dr. Michael Andross had been unknowingly used as the seed for genetic research. Today, he is a narcotics addict and each day of his life, he is...",
    coverSrc: "/images/books/whip-the-dogs.jpg",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXX",
    retailers: [
      {
        id: "amazon",
        label: "Amazon",
        url: "https://www.amazon.com/dp/XXXXXXXX",
      },
      {
        id: "amazon-uk",
        label: "Amazon UK",
        url: "https://www.amazon.co.uk/dp/XXXXXXXX",
      },
      {
        id: "amazon-ca",
        label: "Amazon CA",
        url: "https://www.amazon.ca/dp/XXXXXXXX",
      },
      {
        id: "amazon-AU",
        label: "Amazon AU",
        url: "https://www.amazon.com.au/dp/B009596W5O",
      },
    ],
    // NUEVO: marcar como “upcoming” y fecha de lanzamiento en diciembre
    availability: "upcoming",
    releaseDate: "2025-12-01",
    about: `The Weapons of War are Always Changing.

In the real world, clandestine scientific research has already created UNNATURAL BORN KILLERS, super soldiers, genetically modified killing machines.

In America, Dr. Michael Andross had been unknowingly used as the seed for genetic research. Today, he is a narcotics addict and each day of his life, he is watched; at first only by the people who used him but now by the people who stole the technology.

Andross detests the drug that will keep him sane while his body craves the needle that will keep him alive. But the doctor is more than just collateral damage.

Through espionage and military twists, Andross becomes a pawn in a game of military bluster. He is the secret key in a psychological battle of who will use their nuclear weapons first. Will it be the United States of America? Or will it be a failing state, unable to cling to power in any other way?`,
  },
];
