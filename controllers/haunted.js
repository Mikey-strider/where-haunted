const express = require('express');
const router = express.Router();

const Haunted = require('../models/haunt.js');


router.post('/:ghostsId/reviews', async (req, res) => {
  try {
    const currentHaunt = await Haunted.findById(req.params.ghostsId);
    const reviewDoc = currentHaunt.reviews;
      reviewDoc.push(req.body)
      await currentHaunt.save()
    console.log(currentHaunt)

    res.redirect(`/ghosts/${req.params.ghostsId}`)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})



router.put('/:ghostsId', async (req, res) => {
  try {
    const currentHaunt = await Haunted.findById(req.params.ghostsId)
    if (currentHaunt.creator.equals(req.session.user._id)){
      await currentHaunt.updateOne(req.body);
      res.redirect('/ghosts')
      console.log('Permission granted')
    } else {
      console.log('Permission denied')
      res.send(`A PUT request was issued for ${req.params.ghostsId}`)
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
})


router.get('/:ghostsId/edit', async (req, res) => {
  try {
   const currentHaunt = await Haunted.findById(req.params.ghostsId)
   res.render('ghosts/edit.ejs', {currentHaunt})
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

router.delete('/:ghostsId', async (req, res) => {
  try {
    const ghostDoc = await Haunted.findById(req.params.ghostsId)

    if(ghostDoc.creator.equals(req.session.user._id)){
      await ghostDoc.deleteOne();
      res.redirect('/ghosts')
    } else {
      res.send('You do not have permission to delete that.')
    }
   

  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

router.get('/', async (req, res) => {
  try {
    const populatedHaunt = await Haunted.find({}).populate('creator');

    res.render('ghosts/index.ejs', {
      ghosts: populatedHaunt,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.creator = req.session.user._id;
    const ghostDoc = await Haunted.create(req.body);
    res.redirect('/ghosts')
  } catch (err) {
    console.log(err);
    res.redirect('/')
  }
});


router.get('/new', async (req, res) => {
  res.render('ghosts/new.ejs')
})

router.get('/:ghostsId', async (req, res) => {
  try {
    const populatedHaunt = await Haunted.findById(
      req.params.ghostsId
    ).populate('creator');
    console.log(populatedHaunt, '<---- listing show page')



    const reviewedByUser = populatedHaunt.reviews.some((userId) => {
      return userId.equals(req.session.user._id)
    })

    res.render('ghosts/show.ejs', {
      ghosts: populatedHaunt,
      reviewedByUser: reviewedByUser
    });

  } catch (err) {
    console.log(err);
    res.redirect('/')
  }
})




module.exports = router;
