// DOM ready
$(function () {
  $("h1").css({ color: "#395b7e", textTransform: "underline" });
  $(".hide").hide("slow", () => console.log("hidden"));

  $("*").css({
    boxSizing: "border-box",
  });

  $("body").css({
    display: "grid",
    placeItems: "center",
  });

  // button
  $("button")
    .css({
      padding: "10px",
      width: "100px",
      border: "none",
      margin: "5px",
      backgroundColor: "darkCyan",
      color: "white",
      fontWeight: "bold",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "all .2s",
    })
    .focus(function () {
      $(this).css({ outline: "2px dashed black", outlineOffset: "2px" });
    })
    .blur(function () {
      $(this).css({ outline: "0px" });
    })
    .hover(
      function () {
        $(this).css({
          backgroundColor: "#c97649",
        });
      },
      function () {
        $(this).css("backgroundColor", "darkCyan");
      }
    );

  //p
  $("p").css({
    maxWidth: "600px",
  });

  // specific button
  $(".btn")
    .text("Hover Me")
    .click(() => {
      $(".title").html("Oh, <code>.btn</code> got clicked").css({
        color: "darkCyan",
      });
    })
    .dblclick(() => {
      $(".title").text("Double Clicked");
    });

  // input
  $(".input")
    .css({
      borderRadius: "5px",
      width: "250px",
      height: "40px",
      margin: "10px",
      padding: "5px",
      fontSize: "1rem",
      transition: "150ms",
    })
    .focus(function () {
      $(this).css({ outline: "2px solid darkCyan", outlineOffset: "2px" });
    })
    .blur(function () {
      $(this).css({ outline: "0px" });
    })
    .on("keyup", function (e) {
      if (e.key !== "Enter") return;
      $(".input-text").text($(this).val()).show();
      // to get attribute value from jquery, use .attr()
    });

  // subscribe button
  $(".subscribe")
    .css({ textTransform: "uppercase", width: "130px" })
    .on({
      click: function () {
        $(this).text("subscribed").css({
          backgroundColor: "lime",
        });
      },
      dblclick: function () {
        $(this).text("already subscribed").css({
          width: "180px",
        });
      },
    });
});

$(".toggle-btn").click(function () {
  $(".toggle").toggle("slow");
});

// slide
$(".slide").css({
  width: "300px",
  height: "90px",
  backgroundColor: "orangeRed",
});

$(".slide-toggle").click(function () {
  $(".slide").slideToggle();
});

// animate
$(".animate").css({
  position: "relative",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "magenta",
});

$(".animate-btn").click(function () {
  $(".animate").animate(
    {
      left: "500px",
    },
    "slow"
  );
  $(".animate").animate(
    {
      left: "-500px",
    },
    "slow"
  );
  $(".animate").animate(
    {
      left: "0px",
    },
    "slow"
  );
});

// fade
$(".fade")
  .css({
    "background-color": "cyan",
  })
  .width(100)
  .height(100);

$(".fade-btn").click(function () {
  $(".fade").fadeToggle();
}); // there's a fadeTo() method too
// also don't forget the stop() method

console.log($(".btn").css("width"));

$(".data").load("data.txt #p", function (responseTxt, statusTxt, xhr) {
  console.log(responseTxt);
  if (statusTxt == "success")
    console.log("External content loaded successfully!");
  if (statusTxt == "error")
    console.error("Error: " + xhr.status + ": " + xhr.statusText);
});

$.get("data.txt", function (data, status) {
  console.log(data, status);
});

$.post(
  "post.asp",
  { name: "Duck", city: "Duckburge" },
  function (data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
  }
);

// filter
$("#myInput").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#myTable tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
