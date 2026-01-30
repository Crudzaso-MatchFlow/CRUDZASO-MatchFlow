# Crudzaso-MatchFlow

Sistema de gestión de candidatos, empresas y ofertas laborales.

## 📋 Descripción

MatchFlow es una plataforma que conecta candidatos con empresas a través de ofertas laborales, gestionando el proceso completo de matching y seguimiento de candidaturas.

## 🗂️ Estructura de Datos

### 1. Candidates (Candidatos)

Información de los candidatos disponibles en la plataforma.

```json
{
  "id": "string/number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "profession": "string",
  "openToWork": "boolean",
  "bio": "string",
  "reservedBy": "null o company_id",
  "reservedForOffer": "null o jobOffer_id"
}
```

**Campos:**
- `id`: Identificador único del candidato
- `name`: Nombre completo
- `email`: Correo electrónico
- `phone`: Número de teléfono
- `profession`: Profesión o área de especialización
- `openToWork`: Indica si está buscando empleo activamente
- `bio`: Biografía o descripción personal
- `reservedBy`: ID de la empresa que ha reservado al candidato (si aplica)
- `reservedForOffer`: ID de la oferta laboral asociada a la reserva

---

### 2. Companies (Empresas)

Información de las empresas registradas en la plataforma.

```json
{
  "id": "string/number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "description": "string",
  "industry": "string"
}
```

**Campos:**
- `id`: Identificador único de la empresa
- `name`: Nombre de la empresa
- `email`: Correo electrónico corporativo
- `phone`: Número de teléfono
- `description`: Descripción de la empresa
- `industry`: Sector o industria

---

### 3. Job Offers (Ofertas Laborales)

Publicaciones de empleos creadas por las empresas.

```json
{
  "id": "string/number",
  "companyId": "number",
  "title": "string",
  "description": "string",
  "profession": "string",
  "createdAt": "string",
  "isActive": "boolean"
}
```

**Campos:**
- `id`: Identificador único de la oferta
- `companyId`: ID de la empresa que publica (FK → companies)
- `title`: Título de la posición
- `description`: Descripción detallada del puesto
- `profession`: Profesión requerida (debe coincidir con profession de candidates)
- `createdAt`: Fecha de creación (formato ISO)
- `isActive`: Estado de la oferta (activa/inactiva)

---

### 4. Matches (Coincidencias)

Registro de las conexiones entre candidatos, empresas y ofertas laborales.

```json
{
  "id": "string/number",
  "companyId": "number",
  "candidateId": "number",
  "jobOfferId": "number",
  "status": "string",
  "createdAt": "string"
}
```

**Campos:**
- `id`: Identificador único del match
- `companyId`: ID de la empresa (FK → companies)
- `candidateId`: ID del candidato (FK → candidates)
- `jobOfferId`: ID de la oferta laboral (FK → jobOffers)
- `status`: Estado del proceso
  - `pending`: Pendiente de revisión
  - `contacted`: Candidato contactado
  - `interview`: En proceso de entrevista
  - `hired`: Contratado
  - `discarded`: Descartado
- `createdAt`: Fecha de creación del match (formato ISO)

---

## 🔗 Relaciones

- Un **candidate** puede tener múltiples **matches**
- Una **company** puede tener múltiples **jobOffers**
- Una **company** puede tener múltiples **matches**
- Un **jobOffer** pertenece a una **company**
- Un **match** conecta un **candidate** con una **company** y un **jobOffer**

---

## 🚀 Uso

Este proyecto utiliza `db.json` como base de datos para un servidor JSON simulado (JSON Server).
