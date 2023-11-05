  // Test the getShowsByTerm function
describe("TV Maze Functions", function () {
  describe("getShowsByTerm", function () {
    it("should return an array of show objects", async function () {
      const term = "test";
      const shows = await getShowsByTerm(term);
      expect(Array.isArray(shows)).toBe(true);
      shows.forEach((show) => {
        expect(show.id).toBeDefined();
        expect(show.name).toBeDefined();
        expect(show.summary).toBeDefined();
        expect(show.image).toBeDefined();
      });
    });
  });

  // Test the createShowCard function
  describe("createShowCard", function () {
    it("should create a valid show card element", function () {
      const show = {
        id: 1,
        name: "Test Show",
        summary: "Test summary",
        image: "test.jpg",
      };
      const showCard = createShowCard(show);
      expect(showCard).toBeDefined();
    });
  });

  describe("populateShows", function () {
    it("should populate the shows list in the DOM", function () {
      const shows = [
        { id: 1, name: "Show 1", summary: "Summary 1", image: "image1.jpg" },
        { id: 2, name: "Show 2", summary: "Summary 2", image: "image2.jpg" },
      ];
      populateShows(shows);
  
      //Verify that the show cards have been added to the shows list in the DOM
      const showList = document.getElementById("showsList");
      const showCards = showList.getElementsByClassName("Show");
      
      expect(showCards.length).toBe(2); 
    });
  });
  describe("searchForShowAndDisplay", function () {
    it("should fetch and display shows from the API", async function () {
      // Mocking the API response
      const mockShows = [
        { id: 1, name: "Show 1", summary: "Summary 1", image: "image1.jpg" },
        { id: 2, name: "Show 2", summary: "Summary 2", image: "image2.jpg" },
      ];
  
      // Mocking the getShowsByTerm function to return the mockShows
      spyOn(window, "getShowsByTerm").and.returnValue(Promise.resolve(mockShows));
  
      // Simulate form submission
      $("#searchForm-term").val("test term");
      await searchForShowAndDisplay();
  
      // Check if getShowsByTerm was called with the correct term
      expect(window.getShowsByTerm).toHaveBeenCalledWith("test term");
  
      // Ensure that the shows list in the DOM has been populated
      const showList = document.getElementById("showsList");
      const showCards = showList.getElementsByClassName("Show");
  
      expect(showCards.length).toBe(2); 

    });
  });
  

  describe("populateEpisodes", function () {
    it("should populate the episodes list in the DOM", function () {
      const episodes = [
        { name: "Episode 1", season: 1, number: 1 },
        { name: "Episode 2", season: 1, number: 2 },
      ];
  
      populateEpisodes(episodes);
  
      //Verify that the episode items have been added to the episodes list in the DOM
      const episodesList = document.getElementById("episodesList");
      const episodeItems = episodesList.getElementsByTagName("li");
      // Check the number of episode items added
      expect(episodeItems.length).toBe(2);
    });
  });
  
  
});
