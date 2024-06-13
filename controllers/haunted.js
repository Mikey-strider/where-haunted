const express = require('express');
const router = express.Router();

const Haunted = require('../models/haunt.js');


router.post('/:ghostsId', async (req, res) => {
  try {
    const ghostReview = await Haunted.findById(req.params.ghostsId, {
      $push: { reviewedByUsers: req.params.ghostsId }
    })

    res.redirect(`/ghosts/${req.params.ghostsId}`)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

router.put('/:ghostsId', async (req, res) => {
  try {
    const currentHaunt = await Haunted.findById(req.params.ghostsId)
    currentHaunt.set(req.body)
    await currentHaunt.save()
    res.redirect(`/ghosts/${req.params.ghostsId}`)

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
    const ghost = await Haunted.findById(req.params.ghostsId)
    if (ghost.creator.equals(req.session.user._id)) {
      await ghost.deleteOne();

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
    const populatedHaunts = await Haunted.find({}).populate('creator');

    res.render('ghosts/index.ejs', {
      ghosts: populatedHaunts,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.creator = req.session.user._id;
    const ghost = await Haunted.create(req.body);
    console.log(ghost);
    res.redirect('/ghosts');
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
    const populatedHaunts = await Haunted.findById(
      req.params.ghostsId
    ).populate('creator');
    console.log(populatedHaunts, '<------- haunts on show page');

    const isfavoritedByUser = populatedHaunts.favoritedByUsers
    console
    res.render('ghosts/show.ejs', {
      ghosts: populatedHaunts,
      isfavoritedByUser: isfavoritedByUser
    });

  } catch (err) {
    console.log(err);
    res.redirect('/')
  }
})




module.exports = router;
