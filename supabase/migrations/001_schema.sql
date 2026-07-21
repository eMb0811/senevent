CREATE TABLE public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    nom TEXT NOT NULL,

    telephone TEXT,

    role TEXT NOT NULL DEFAULT 'PUBLIC'
        CHECK (role IN ('PUBLIC', 'ORGANISATEUR', 'ADMIN')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.evenements (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    titre TEXT NOT NULL
        CHECK (char_length(titre) >= 3),

    categorie TEXT NOT NULL
        CHECK (
            categorie IN (
                'concert',
                'expo',
                'conference',
                'atelier',
                'soutenance'
            )
        ),

    lieu_nom TEXT NOT NULL,

    date_debut TIMESTAMPTZ NOT NULL,

    prix INTEGER NOT NULL DEFAULT 0
        CHECK (prix >= 0),

    image_url TEXT,

    organisateur_id UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.inscriptions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    evenement_id BIGINT NOT NULL
        REFERENCES public.evenements(id)
        ON DELETE CASCADE,

    utilisateur_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (evenement_id, utilisateur_id)
);
