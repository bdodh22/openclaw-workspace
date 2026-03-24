#!/usr/bin/env python3
"""Tests for SearXNG CLI script."""

import pytest
import sys
import os
from unittest.mock import patch, MagicMock
from io import StringIO

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.searxng import search_searxng, display_results_table, display_results_json


class TestSearchSearxng:
    """Test search_searxng function."""
    
    @patch('scripts.searxng.httpx.get')
    def test_search_success(self, mock_get):
        """Test successful search."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "results": [
                {"title": "Test Result", "url": "https://example.com", "engines": ["google"]}
            ],
            "number_of_results": 1
        }
        mock_get.return_value = mock_response
        
        result = search_searxng("test query", limit=10)
        
        assert "results" in result
        assert len(result["results"]) == 1
        assert result["results"][0]["title"] == "Test Result"
        mock_get.assert_called_once()
    
    @patch('scripts.searxng.httpx.get')
    def test_search_limits_results(self, mock_get):
        """Test that results are limited correctly."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "results": [{"title": f"Result {i}", "url": f"https://example{i}.com"} for i in range(20)],
            "number_of_results": 20
        }
        mock_get.return_value = mock_response
        
        result = search_searxng("test query", limit=5)
        
        assert len(result["results"]) == 5
    
    @patch('scripts.searxng.httpx.get')
    def test_search_http_error(self, mock_get):
        """Test HTTP error handling."""
        import httpx
        mock_get.side_effect = httpx.HTTPError("Connection failed")
        
        result = search_searxng("test query")
        
        assert "error" in result
        assert result["results"] == []
    
    @patch('scripts.searxng.httpx.get')
    def test_search_with_category(self, mock_get):
        """Test search with category parameter."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [], "number_of_results": 0}
        mock_get.return_value = mock_response
        
        search_searxng("test query", category="images")
        
        # Verify category was passed
        call_args = mock_get.call_args
        assert call_args[1]['params']['categories'] == 'images'
    
    @patch('scripts.searxng.httpx.get')
    def test_search_with_time_range(self, mock_get):
        """Test search with time range parameter."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [], "number_of_results": 0}
        mock_get.return_value = mock_response
        
        search_searxng("test query", time_range="day")
        
        call_args = mock_get.call_args
        assert call_args[1]['params']['time_range'] == 'day'
    
    @patch('scripts.searxng.httpx.get')
    def test_search_with_language(self, mock_get):
        """Test search with language parameter."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [], "number_of_results": 0}
        mock_get.return_value = mock_response
        
        search_searxng("test query", language="en")
        
        call_args = mock_get.call_args
        assert call_args[1]['params']['language'] == 'en'
    
    def test_search_default_url(self):
        """Test default URL when SEARXNG_URL not set."""
        with patch.dict(os.environ, {}, clear=True):
            from scripts import searxng
            # Reload module to pick up env change
            import importlib
            importlib.reload(searxng)
            
            assert searxng.SEARXNG_URL == "http://localhost:8080"


class TestDisplayResults:
    """Test display functions."""
    
    def test_display_results_json(self, capsys):
        """Test JSON output format."""
        data = {
            "results": [{"title": "Test", "url": "https://example.com"}],
            "number_of_results": 1
        }
        
        display_results_json(data)
        
        captured = capsys.readouterr()
        assert "Test" in captured.out
        assert "https://example.com" in captured.out
    
    def test_display_results_table_empty(self, capsys):
        """Test table display with no results."""
        data = {"results": [], "number_of_results": 0}
        
        display_results_table(data, "test query")
        
        captured = capsys.readouterr()
        assert "No results found" in captured.out
    
    @patch('scripts.searxng.console.print')
    @patch('scripts.searxng.rprint')
    def test_display_results_table_with_results(self, mock_rprint, mock_console_print):
        """Test table display with results."""
        data = {
            "results": [
                {"title": "Test Result", "url": "https://example.com", "engines": ["google"]},
                {"title": "Another Result", "url": "https://example2.com", "engines": ["bing"]}
            ],
            "number_of_results": 2
        }
        
        display_results_table(data, "test query")
        
        # Should print table and results
        assert mock_console_print.called or mock_rprint.called


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
