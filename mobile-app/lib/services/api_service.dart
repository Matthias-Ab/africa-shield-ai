import 'dart:convert';
import 'package:http/http.dart' as http;

import '../config/env.dart';
import '../models/alert.dart';
import '../models/region.dart';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

/// Thin wrapper over the real backend. Every method here hits an endpoint
/// that's already built and tested — see docs/api-contract.md. Nothing in
/// this file is a mock; if the backend isn't reachable, callers get a
/// real ApiException and should fall back to CacheService's last-known data.
class ApiService {
  final http.Client _client;
  final String baseUrl;

  ApiService({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        baseUrl = baseUrl ?? Env.apiBaseUrl;

  Future<List<Region>> fetchRegions() async {
    final uri = Uri.parse('$baseUrl/api/regions');
    final response = await _get(uri);
    final data = jsonDecode(response.body) as List<dynamic>;
    return data
        .map((e) => Region.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<AlertEvent>> fetchAlerts() async {
    final uri = Uri.parse('$baseUrl/api/alerts');
    final response = await _get(uri);
    final data = jsonDecode(response.body) as List<dynamic>;
    return data
        .map((e) => AlertEvent.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<http.Response> _get(Uri uri) async {
    try {
      final response = await _client.get(uri).timeout(
            const Duration(seconds: 10),
          );
      if (response.statusCode != 200) {
        throw ApiException(
          'Backend returned ${response.statusCode} for $uri',
        );
      }
      return response;
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Could not reach the backend: $e');
    }
  }
}
