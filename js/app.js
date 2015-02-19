 // This will create your new application called App
App = Ember.Application.create();

 // Creates an Artist object which has a name attribute
App.Artist = Ember.Object.extend({
  name: null,

  slug: function() {
    return this.get('name').dasherize();
  }.property('name'),

  songs: function() {
    return App.Songs.filterProperty('artist', this.get('name'));
  }.property('name', 'App.Songs.@each.artist')
});

 // Creates a Song object with 3 attributes
App.Song = Ember.Object.extend({
  title: null,
  rating: null,
  artist: null
});

// Simple list of artists to use as a variable
var artistNames = ['Pearl Jam', 'Led Zeppelin', 'Foo Fighters', 'Kaya Project', 'Radiohead', 'Red Hot Chili Peppers'];
App.Artists = artistNames.map(function(name) { return App.Artist.create({ name: name }); });

// Creates a new Array object called Songs
App.Songs = Ember.A();

// Pearl Jam Songs
App.Songs.pushObject(App.Song.create({ title: 'Yellow Ledbetter', artist: 'Pearl Jam', rating: 10 }));
App.Songs.pushObject(App.Song.create({ title: 'Animal', artist: 'Pearl Jam', rating: 8 }));
App.Songs.pushObject(App.Song.create({ title: 'Daughter', artist: 'Pearl Jam', rating: 10 }));
App.Songs.pushObject(App.Song.create({ title: 'State of Love and Trust', artist: 'Pearl Jam', rating: 9 }));
App.Songs.pushObject(App.Song.create({ title: 'Immortality', artist: 'Pearl Jam', rating: 6}));
App.Songs.pushObject(App.Song.create({ title: 'Alive', artist: 'Pearl Jam', rating: 6 }));
App.Songs.pushObject(App.Song.create({ title: 'Given To Fly', artist: 'Pearl Jam', rating: 7 }));
App.Songs.pushObject(App.Song.create({ title: 'Inside Job', artist: 'Pearl Jam', rating: 9 }));

 // Led Zeppelin Songs
 App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 8 }));
 App.Songs.pushObject(App.Song.create({ title: 'Achilles Last Stand', artist: 'Led Zeppelin', rating: 10 }));
 App.Songs.pushObject(App.Song.create({ title: 'Immigrant Song', artist: 'Led Zeppelin', rating: 7 }));
 App.Songs.pushObject(App.Song.create({ title: 'Whole Lotta Love', artist: 'Led Zeppelin', rating: 7 }));

 // Foo Fighters Songs
 App.Songs.pushObject(App.Song.create({ title: 'The Pretender', artist: 'Foo Fighters', rating: 6 }));
 App.Songs.pushObject(App.Song.create({ title: 'Best of You', artist: 'Foo Fighters', rating: 9 }));

 // Kaya Project Songs
 App.Songs.pushObject(App.Song.create({ title: 'Always Waiting', artist: 'Kaya Project', rating: 10 }));

 // Create our Ember routes - urls
App.Router.map(function() {
  this.resource('artists', function() {
    this.route('songs', {path: ':slug' });
  });
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this. transitionTo('artists');
  }
});

// Define the artists route and add a model hook and return all artists
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    return App.Artists;
  },
  actions: {
    createArtist: function() {
      var name = this.get('controller').get('newArtist');
      var artist = App.Artist.create({name: name });
      App.Artists.pushObject(artist);
      this.get('controller').set('newArtist', '');
    }
  }
});

App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    return App.Artists.findProperty('slug', params.slug);
  },
  actions: {
    createSong: function() {
      var title = this.get('controller.newSong');
      var artist = this.get('controller.model.name');

      var song = App.Song.create({ title: title, artist: artist });
      App.Songs.pushObject(song);
      this.get('controller').set('newSong', '');
    }
  }
});

App.StarRating = Ember.View.extend({
  templateName: 'star-rating',
  classNames: ['rating-panel'],

  rating: Ember.computed.alias('context.rating'),
  fullStars: Ember.computed.alias('rating'),
  numStars: Ember.computed.alias('maxRating'),

  stars: function() {
    var ratings = [];
    var fullStars = this.starRange(1, this.get('fullStars'), 'full');
    var emptyStars = this.starRange(this.get('fullStars') + 1, this.get('numStars'), 'empty');
    Array.prototype.push.apply(ratings, fullStars);
    Array.prototype.push.apply(ratings, emptyStars);
    return ratings;
  }.property('fullStars', 'numStars'),

  starRange: function(start, end, type) {
    var starsData = [];
    for (i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    }
    return starsData;
  },
  actions: {
    setRating: function() {
      var newRating = Ember.$(event.target).data('rating');
      this.set('rating', newRating);
    }
  }
});

// EMBER CONVENTION ROUTE AND TEMPLATE SHOULD MATCH
// IF YOUR UI IS NESTED YOUR ROUTES SHOULD BE NESTED

 // This displays the simple array in the index route given by ember
// App.IndexRoute = Ember.Route.extend({
//   model: function() {
//     return ['red', 'yellow', 'blue'];
//   }
// });

// Creates a song collection that sorts the array by the rating property in descending order
// App.SongCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
//   sortProperties: ['rating'],
//   sortAscending: false,
//   content: []
// });

//  // Simply adding new songs to the new Songs array
// App.Songs.pushObject(App.Song.create({ title: 'Black Dog', artist: 'Led Zeppelin', rating: 8 }));
// App.Songs.pushObject(App.Song.create({ title: 'Yellow Ledbetter', artist: 'Pearl Jam', rating: 10 }));
// App.Songs.pushObject(App.Song.create({ title: 'The Pretender', artist: 'Foo Fighters', rating: 6 }));
//
// // Creates a new song which we save in alwaysWaiting variable to add later
// App.alwaysWaiting = App.Song.create({ title: 'Always Waiting', artist: 'Kaya Project', rating: 9 });
