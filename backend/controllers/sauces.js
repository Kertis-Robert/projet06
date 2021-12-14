const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  console.log(req.body.sauce)
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauces.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  })
    .then(
    (sauces) => {
      res.status(200).json(sauces);
    }
    )
    .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
    );
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      const filename = sauces.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then(
    (sauces) => {
      res.status(200).json(sauces);
    }
    )
    .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
    );
};

exports.likeSauce = (req, res) => {
  const sauceObject = req.body;
    const userId = sauceObject.userId;
    const like = sauceObject.like;

  Sauces.findOne({_id: req.params.id}).then((sauce) => {
    if(like == 1) {
      console.log('1');
      sauce.usersLiked.push(userId);
      sauce.likes++;
    }
    else if(like == 0) {
      console.log('0');
      if(sauce.usersLiked.indexOf(userId) === 1) {
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), -1);
      }

      if(sauce.usersDisliked.indexOf(userId) === 1) {
        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), -1);
      }
    }
    else if(like == -1) {
      console.log('-1');
      sauce.usersDisliked.push(userId);
      sauce.likes--;
    }
    
    res.status(200).json({message: 'Sauce modifiée !'})
  })
} 

/*exports.dislikeSauce = (req, res) => {
  Sauces.findOne({_id: req.params.id}).then((sauce) => {
    if(sauce.usersDisliked.indexOf(req.body.userId) === -1) {
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes += req.body.dislike;
    }
    res.status(200).json({message: 'Sauce modifiée !'})
  })
} 

  /*console.log('here');
  Sauces.findOne({_id: req.params.id}).then((sauce) => {


    if(sauce.usersLiked.indexOf(req.body.userId) !== -1) {
     sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
     sauce.likes += -1;
    }
    else if(sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
      sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
      sauce.dislikes += -1;
    }
    else if(sauce.usersLiked.indexOf(req.body.userId) === -1) {
      sauce.usersLiked.push(req.body.userId);
      sauce.likes += req.body.like;
    }
    else if(sauce.usersDisliked.indexOf(req.body.userId) === -1) {
      sauce.usersDisliked.push(req.body.userId);
      sauce.likes += req.body.like;
    }

    Sauces.updateOne({ _id: req.params.id }, JSON.stringify({ ...sauce, _id: req.params.id }))
    .then((response) => {
      console.log(response)
      res.status(200).json({ message: 'Objet modifié !'}) })

    .catch(error => res.status(400).json({ error }));*/