//Importation des modules
const mongoose = require("mongoose");
require("dotenv").config();

// Création du schéma
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] },
});

// modèle à partir du schéma
const Person = mongoose.model("Person", personSchema);

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Création de plusieurs personnes avec Model.create()
const arrayOfPeople = [
  { name: "Moussa Ndiaye", age: 35, favoriteFoods: ["steak", "salad"] },
  { name: "Fatou Sy", age: 23, favoriteFoods: ["pizza", "burgers"] },
  { name: "Bocas Sow", age: 30, favoriteFoods: ["sushi", "pasta"] },
];

Person.create(arrayOfPeople)
  .then((createdPeople) => {
    console.log("Personnes créées avec succès :", createdPeople);

    //model.find() pour rechercher dans la base de données
    Person.find({ name: "Fatou Sy" })
      .then((foundPeople) => {
        console.log("Personnes trouvées :", foundPeople);
      })
      .catch((err) => {
        console.log(err);
      });

    // model.findOne() pour renvoyer un seul document correspondant
    Person.findOne({ favoriteFoods: "pizza" })
      .then((foundPerson) => {
        console.log("Personne trouvée :", foundPerson);
      })
      .catch((err) => {
        console.log(err);
      });

    // model.findById() pour rechercher dans la base de données par _id
    const personId = "id";
    Person.findById(personId)
      .then((foundPerson) => {
        console.log("Personne trouvée :", foundPerson);
      })
      .catch((err) => {
        console.log(err);
      });

    // mises à jour classiques en exécutant Rechercher, Modifier, puis Enregistrer
    const personToUpdateId = "id";
    Person.findById(personToUpdateId)
      .then((personToUpdate) => {
        if (personToUpdate) {
          personToUpdate.favoriteFoods.push("hamburger");
          return personToUpdate.save();
        } else {
          console.log("Aucune personne trouvée avec l'ID fourni.");
        }
      })
      .then((updatedPerson) => {
        console.log("Personne mise à jour :", updatedPerson);
      })
      .catch((err) => {
        console.log(err);
      });

    // nouvelles mises à jour sur un document à l'aide de model.findOneAndUpdate()
    const personName = "Bocar Sow";
    Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true })
      .then((updatedPerson) => {
        console.log("Personne mise à jour :", updatedPerson);
      })
      .catch((err) => {
        console.log(err);
      });

    // Supprimer un document à l'aide de model.findByIdAndRemove
    const personToDeleteId = "id";
    Person.findByIdAndRemove(personToDeleteId)
      .then((removedPerson) => {
        if (removedPerson) {
          console.log("Personne supprimée :", removedPerson);
        } else {
          console.log("Aucune personne trouvée avec l'ID fourni.");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // MongoDB et Mongoose - Supprimer de nombreux documents avec model.remove()
    Person.remove({ name: "Jean Doe" })
      .then((result) => {
        console.log("Nombre de personnes supprimées :", result.deletedCount);
      })
      .catch((err) => {
        console.log(err);
      });

    // Chain Search Query Helpers pour affiner les résultats de recherche
    Person.find({ favoriteFoods: "burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select("-age")
      .exec((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Résultats de la recherche :", data);
        }
      });
  })
  .catch((err) => {
    console.log(err);
  });
