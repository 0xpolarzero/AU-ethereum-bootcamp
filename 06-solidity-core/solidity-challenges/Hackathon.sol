// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hackathon {
    struct Project {
        string title;
        uint[] ratings;
    }

    Project[] private projects;

    function newProject(string calldata _title) external {
        // creates a new project with a title and an empty ratings array
        projects.push(Project(_title, new uint[](0)));
    }

    function rate(uint _idx, uint _rating) external {
        // rates a project by its index
        projects[_idx].ratings.push(_rating);
    }

    // This function does not take into account the case where there are
    // multiple projects with the same average rating
    // But here we need to return only one project for the test to pass
    // We should better return an array of projects to take this case into account
    function findWinner() external view returns (Project memory) {
        Project[] memory memProjects = projects;
        // Init winner id & highest score
        uint256 winnerId;
        uint256 highestAvg;

        // Go through all projects
        for (uint256 i = 0; i < memProjects.length; i++) {
            uint256 total;

            // Go through all ratings
            for (uint256 j = 0; j < memProjects[i].ratings.length; j++) {
                // Get the total score
                total += memProjects[i].ratings[i];
            }

            // Get the average rating
            uint256 avg = total / memProjects[i].ratings.length;
            // If it higher than the previous one, it's the winner
            if (avg > highestAvg) {
                highestAvg = avg;
                winnerId = i;
            }
        }

        return memProjects[winnerId];
    }

    function getProjects() external view returns (Project[] memory) {
        return projects;
    }
}
